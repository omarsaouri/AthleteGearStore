import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

console.log("Email Service Configuration:", {
  hasApiKey: !!process.env.RESEND_API_KEY,
  environment: process.env.NODE_ENV,
});

// Force a log of all environment variables (safely)
console.log("Available ENV keys:", Object.keys(process.env));

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.log("User not found:", email);
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json({
        message: "If an account exists, you will receive reset instructions.",
      });
    }

    // Generate reset token
    const resetToken = Buffer.from(`${user.id}-${Date.now()}`).toString(
      "base64"
    );

    // Store reset token in database with expiration
    const { error: insertError } = await supabase
      .from("password_resets")
      .insert([
        {
          user_id: user.id,
          token: resetToken,
          expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        },
      ]);

    if (insertError) {
      console.error("Error storing reset token:", insertError);
      throw new Error("Failed to process password reset");
    }

    // Send reset email
    try {
      const resetLink = `${APP_URL}/reset-password/${resetToken}`;

      console.log("Starting email send process...");
      console.log("Configuration:", {
        to: email,
        resetLink,
        resendInitialized: !!resend,
      });

      // Test Resend connection
      try {
        console.log("Testing Resend connection...");
        const testResponse = await resend.emails.send({
          from: "Admin <onboarding@resend.dev>",
          to: "onboarding@resend.dev", // Test with Resend's test email
          subject: "Test Email",
          html: "This is a test email",
        });
        console.log("Test email response:", testResponse);
      } catch (testError) {
        console.error("Test email failed:", testError);
      }

      // Proceed with actual reset email
      console.log("Sending actual reset email...");
      const { data: emailResponse, error: emailError } =
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to:
            process.env.NODE_ENV === "development"
              ? "osaouri13@gmail.com" // In development, always send to your email
              : email,
          subject: "Reset Your Password",
          html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #27472a; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #4b5563; margin-bottom: 20px;">
              Hello${user.name ? ` ${user.name}` : ""},
            </p>
            
            <p style="color: #4b5563; margin-bottom: 20px;">
              We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
            </p>
            
            <p style="color: #4b5563; margin-bottom: 20px;">
              To reset your password, click the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}"
                style="background-color: #a1cca5; color: #27472a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #4b5563; margin-bottom: 10px;">
              Or copy and paste this link in your browser:
            </p>
            
            <p style="color: #4b5563; word-break: break-all;">
              ${resetLink}
            </p>
            
            <p style="color: #4b5563; margin-top: 30px;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <hr style="border: 1px solid #e5e7eb; margin: 30px 0;" />
            
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
        `,
        });

      if (emailError) {
        console.error("Error sending email:", emailError);
        throw new Error(`Failed to send reset email: ${emailError.message}`);
      }

      // Add debug logging
      console.log("Email attempt details:", {
        environment: process.env.NODE_ENV,
        recipientEmail:
          process.env.NODE_ENV === "development"
            ? "osaouri13@gmail.com"
            : email,
        success: !emailError,
      });

      console.log("Reset email sent successfully. Response:", {
        id: emailResponse?.id,
        to: email,
        timestamp: new Date().toISOString(),
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't expose email sending errors to the client
      return NextResponse.json({
        message: "If an account exists, you will receive reset instructions.",
      });
    }

    return NextResponse.json({
      message: "If an account exists, you will receive reset instructions.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Failed to process password reset" },
      { status: 500 }
    );
  }
}
