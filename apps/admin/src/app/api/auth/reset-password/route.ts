import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    console.log("Received reset request with token:", token);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // First decode the URL-safe token back to the original base64
    const decodedToken = decodeURIComponent(token);
    console.log("URL decoded token:", decodedToken);

    // Find the reset token in the database
    const { data: resetToken, error: tokenError } = await supabase
      .from("password_resets")
      .select("*")
      .eq("token", decodedToken)
      .gt("expires_at", new Date().toISOString())
      .single();

    console.log("Reset token lookup:", { resetToken, tokenError });

    if (tokenError || !resetToken) {
      console.log("Token error or not found:", tokenError);
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
          details: tokenError ? tokenError.message : "Token not found",
        },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", resetToken.user_id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating password:", updateError);
      throw updateError;
    }

    // Delete the used reset token
    const { error: deleteError } = await supabase
      .from("password_resets")
      .delete()
      .eq("token", decodedToken);

    if (deleteError) {
      console.error("Error deleting reset token:", deleteError);
      // Continue anyway since the password was updated successfully
    }

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        error: "Failed to reset password. Please try again later.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
