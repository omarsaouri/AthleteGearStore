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
        <h1>New User Registration</h1>
        <p>A new user has registered with the following details:</p>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>          
          <li>Registration Time: ${new Date().toLocaleString()}</li>
        </ul>
        <p>Click the button below to verify this user:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify/${verificationToken}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Verify User
        </a>

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
