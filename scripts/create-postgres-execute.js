// Script to create the postgres_execute function in Supabase
// Run with: node scripts/create-postgres-execute.js

const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.local file
const envPath = path.resolve(process.cwd(), "apps/admin/.env.local");
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL and key must be provided in .env.local file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createPostgresExecuteFunction() {
  console.log("Creating postgres_execute function...");

  try {
    // Use the REST API to create the function since we can't create it with the function itself
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/postgres_execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          query: `
          CREATE OR REPLACE FUNCTION postgres_execute(query text)
          RETURNS json
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            result json;
          BEGIN
            EXECUTE query;
            result := json_build_object('success', true);
            RETURN result;
          EXCEPTION WHEN OTHERS THEN
            result := json_build_object(
              'success', false,
              'error', SQLERRM,
              'error_detail', SQLSTATE
            );
            RETURN result;
          END;
          $$;
        `,
        }),
      },
    );

    if (response.ok) {
      console.log("✅ postgres_execute function created successfully");
    } else {
      const errorData = await response.json();
      console.error("Error creating postgres_execute function:", errorData);

      // The function might already exist, so let's just create the categories table
      console.log("Trying to create categories table directly...");

      // Create categories table directly using SQL
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: "Clothing",
            slug: "clothing",
            description: "Athletic clothing and apparel",
          },
          { name: "Shoes", slug: "shoes", description: "Athletic footwear" },
          {
            name: "Accessories",
            slug: "accessories",
            description: "Sports accessories and gear",
          },
          {
            name: "Equipment",
            slug: "equipment",
            description: "Sports equipment",
          },
        ])
        .select();

      if (error) {
        console.error("Error creating categories directly:", error);
        throw error;
      }

      console.log("✅ Categories created directly:", data);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createPostgresExecuteFunction();
