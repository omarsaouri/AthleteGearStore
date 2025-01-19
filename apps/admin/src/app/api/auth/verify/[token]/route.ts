import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    console.log("Received token:", token);

    // Decode the token to get the user ID
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    console.log("Decoded token:", decoded);

    // Extract just the user ID (everything before the timestamp)
    const uuidRegex =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    const match = decoded.match(uuidRegex);

    if (!match) {
      throw new Error("Invalid token format - UUID not found");
    }

    const userId = match[0];
    console.log("Extracted User ID:", userId);

    // First check if user exists and their current verification status
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, is_verified")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      throw new Error(`User not found with ID: ${userId}`);
    }

    console.log("Existing user:", existingUser);

    // Perform the update
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("id", userId);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    // Verify the update was successful
    const { data: verifiedUser, error: verifyError } = await supabase
      .from("users")
      .select("id, is_verified")
      .eq("id", userId)
      .single();

    if (verifyError) {
      console.error("Verification check error:", verifyError);
      throw verifyError;
    }

    console.log("Updated user:", verifiedUser);

    // Return success HTML response
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>User Verification</title>
          <style>
            :root {
              --background: #181b18;
              --foreground: #232924;
              --border: #3b453c;
              --primary: #a1cca5;
              --copy: #fbfbfb;
              --copy-light: #d6dcd6;
            }

            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: var(--background);
              color: var(--copy);
            }

            .container {
              text-align: center;
              padding: 2.5rem;
              background-color: var(--foreground);
              border-radius: 0.75rem;
              border: 1px solid var(--border);
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
              max-width: 400px;
              width: 90%;
            }

            .success {
              color: var(--primary);
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 1.5rem;
            }

            .message {
              color: var(--copy-light);
              margin-bottom: 1rem;
              line-height: 1.5;
            }

            .icon {
              width: 48px;
              height: 48px;
              margin-bottom: 1.5rem;
              color: var(--primary);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 class="success">User Verified Successfully!</h1>
            <p class="message">The new user account has been verified and activated.</p>
            <p class="message">You can now close this window.</p>
          </div>
        </body>
      </html>
    `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        message: "Failed to verify user",
        error: error instanceof Error ? error.message : "Unknown error",
        details: { error },
      },
      { status: 500 }
    );
  }
}
