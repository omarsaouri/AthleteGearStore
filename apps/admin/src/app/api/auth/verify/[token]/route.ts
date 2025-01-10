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
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .success {
              color: #28a745;
              font-size: 1.2rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✅ User Verified Successfully!</h1>
            <p>User verification status has been updated.</p>
            <p>You can close this window now.</p>
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
