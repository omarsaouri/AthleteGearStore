import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "osaouri13@gmail.com";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          name,
          password: hashedPassword,
          is_verified: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create verification token using the newly created user's ID
    console.log("Created user:", user);
    const verificationToken = Buffer.from(`${user.id}-${Date.now()}`).toString(
      "base64"
    );
    console.log("Generated verification token:", verificationToken);

    // Send notification email to admin
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      subject: "New User Registration Requires Verification",
      html: `
        <div style="background-color: #f9fafb; padding: 40px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 32px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 24px;">New User Registration</h1>
            
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 16px;">A new user has registered with the following details:</p>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="color: #4b5563; margin-bottom: 8px;">Name: <span style="color: #111827; font-weight: 500;">${name}</span></li>
                <li style="color: #4b5563; margin-bottom: 8px;">Email: <span style="color: #111827; font-weight: 500;">${email}</span></li>
                <li style="color: #4b5563;">Registration Time: <span style="color: #111827; font-weight: 500;">${new Date().toLocaleString()}</span></li>
              </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Click the button below to verify this user:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify/${verificationToken}" 
               style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
              Verify User
            </a>
          </div>
        </div>
      `,
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
