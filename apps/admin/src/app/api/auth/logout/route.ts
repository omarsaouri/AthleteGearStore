import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("auth-token");

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 });
  }
}
