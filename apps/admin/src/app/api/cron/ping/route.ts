import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// This endpoint is used to keep the Supabase database alive
// by executing a simple query periodically
export async function GET(request: Request) {
  try {
    const startTime = Date.now();

    // Get information about the request
    const url = new URL(request.url);
    const source = url.searchParams.get("source") || "manual";

    // Simple query to ping the database - avoiding aggregate functions
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("Database ping failed:", error);

      // Log the failed ping
      try {
        await supabase.from("cron_logs").insert({
          endpoint: "admin/api/cron/ping",
          success: false,
          duration_ms: Date.now() - startTime,
          source: source,
          error: error.message,
        });
      } catch (logError) {
        console.error("Failed to log cron execution:", logError);
      }

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

    // Log successful ping to the database
    try {
      // Create the cron_logs table if it doesn't exist first (one-time operation)
      const { error: tableError } = await supabase.rpc(
        "create_cron_logs_if_not_exists",
      );

      if (tableError && !tableError.message.includes("already exists")) {
        console.error("Error checking/creating cron_logs table:", tableError);
      }

      // Log the successful ping
      const { error: logError } = await supabase.from("cron_logs").insert({
        endpoint: "admin/api/cron/ping",
        success: true,
        duration_ms: duration,
        source: source,
        data_snapshot: JSON.stringify(data).substring(0, 255), // Limiting size
      });

      if (logError) {
        console.error("Failed to log cron execution:", logError);
      }
    } catch (logError) {
      console.error("Error logging cron execution:", logError);
    }

    console.log(`Database ping successful in ${duration}ms`, { data });

    return NextResponse.json({
      success: true,
      message: "Database pinged successfully",
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      source: source,
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
