import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// This endpoint sets up the necessary database objects for cron job monitoring
export async function POST() {
  try {
    // 1. Create the RPC function to handle table creation
    const createRpcFunction = `
      CREATE OR REPLACE FUNCTION create_cron_logs_if_not_exists()
      RETURNS void AS $$
      BEGIN
        -- Check if the table exists
        IF NOT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'cron_logs'
        ) THEN
          -- Create the table
          CREATE TABLE public.cron_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            endpoint TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            success BOOLEAN NOT NULL,
            duration_ms INTEGER,
            source TEXT DEFAULT 'cron',
            error TEXT,
            data_snapshot TEXT
          );
          
          -- Create an index on created_at for better query performance
          CREATE INDEX idx_cron_logs_created_at ON public.cron_logs (created_at);
          
          -- Create an index on endpoint for filtering
          CREATE INDEX idx_cron_logs_endpoint ON public.cron_logs (endpoint);
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;

    // 2. Create the stats function
    const createStatsFunction = `
      CREATE OR REPLACE FUNCTION get_cron_stats()
      RETURNS json AS $$
      DECLARE
        result json;
      BEGIN
        SELECT json_build_object(
          'total_executions', (SELECT COUNT(*) FROM cron_logs),
          'successful_executions', (SELECT COUNT(*) FROM cron_logs WHERE success = true),
          'failed_executions', (SELECT COUNT(*) FROM cron_logs WHERE success = false),
          'last_24h_executions', (SELECT COUNT(*) FROM cron_logs WHERE created_at > NOW() - INTERVAL '24 hours'),
          'avg_duration_ms', (SELECT AVG(duration_ms) FROM cron_logs WHERE success = true),
          'endpoints', (
            SELECT json_agg(json_build_object(
              'endpoint', endpoint,
              'count', count,
              'last_execution', last_execution
            ))
            FROM (
              SELECT 
                endpoint,
                COUNT(*) as count,
                MAX(created_at) as last_execution
              FROM cron_logs
              GROUP BY endpoint
              ORDER BY MAX(created_at) DESC
            ) as endpoints
          )
        ) INTO result;

        RETURN result;
      END;
      $$ LANGUAGE plpgsql;
    `;

    // Execute the function creation queries
    const { error: rpcError } = await supabase.rpc("postgres_execute", {
      query: createRpcFunction,
    });

    if (rpcError) {
      console.error("Error creating RPC function:", rpcError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create RPC function",
          error: rpcError.message,
        },
        { status: 500 },
      );
    }

    const { error: statsError } = await supabase.rpc("postgres_execute", {
      query: createStatsFunction,
    });

    if (statsError) {
      console.error("Error creating stats function:", statsError);
      // Continue anyway since this is not critical
    }

    // 3. Run the function to ensure the table exists
    const { error: tableError } = await supabase.rpc(
      "create_cron_logs_if_not_exists",
    );

    if (tableError) {
      console.error("Error creating cron_logs table:", tableError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create cron_logs table",
          error: tableError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cron job monitoring setup completed successfully",
    });
  } catch (error) {
    console.error("Error setting up cron monitoring:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error setting up cron monitoring",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
