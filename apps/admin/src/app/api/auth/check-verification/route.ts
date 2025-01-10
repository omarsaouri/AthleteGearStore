import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Simple in-memory rate limiting
const RATE_LIMIT_DURATION = 60 * 1000; // 60 seconds
const MAX_ATTEMPTS = 3; // 3 attempts per minute

const rateLimit = new Map<string, { attempts: number; timestamp: number }>();

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(email);

  if (!userLimit) {
    rateLimit.set(email, { attempts: 1, timestamp: now });
    return false;
  }

  if (now - userLimit.timestamp > RATE_LIMIT_DURATION) {
    rateLimit.set(email, { attempts: 1, timestamp: now });
    return false;
  }

  if (userLimit.attempts >= MAX_ATTEMPTS) {
    return true;
  }

  userLimit.attempts += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (isRateLimited(email)) {
      return NextResponse.json(
        {
          message:
            "Too many verification checks. Please wait a minute before trying again.",
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("is_verified")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      verified: user.is_verified,
      message: user.is_verified
        ? "Your account has been verified! You can now log in."
        : "Your account is still pending verification. Please check back later.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to check verification status" },
      { status: 500 }
    );
  }
}
