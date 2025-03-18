import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// This endpoint is used to keep the Supabase database alive
// by executing a simple query periodically
export async function GET() {
  try {
    const startTime = Date.now();

    // Simple query to ping the database - avoiding aggregate functions
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Database ping failed:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to ping database",
          error: error.message,
        },
        { status: 500 },
      );
    }

    const duration = Date.now() - startTime;

    console.log(`Database ping successful in ${duration}ms`, { data });

    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error("Error pinging database:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error pinging database",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
