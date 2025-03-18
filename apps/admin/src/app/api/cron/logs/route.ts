import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// This endpoint fetches the cron job execution logs
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const endpoint = url.searchParams.get("endpoint");

    let query = supabase
      .from("cron_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (endpoint) {
      query = query.eq("endpoint", endpoint);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching cron logs:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch cron logs",
          error: error.message,
        },
        { status: 500 },
      );
    }

    // Get statistics
    const { data: stats, error: statsError } =
      await supabase.rpc("get_cron_stats");

    if (statsError) {
      console.error("Error fetching cron statistics:", statsError);
    }

    return NextResponse.json({
      success: true,
      logs: data || [],
      count,
      stats: stats || {},
      pagination: {
        limit,
        offset,
        next: (data?.length || 0) === limit ? offset + limit : null,
      },
    });
  } catch (error) {
    console.error("Error fetching cron logs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching cron logs",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
