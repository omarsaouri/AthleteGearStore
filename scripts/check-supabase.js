// Script to check Supabase connectivity
// Run with: node scripts/check-supabase.js

const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.local file
const envPath = path.resolve(process.cwd(), "apps/admin/.env.local");
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL and key must be provided in .env.local file");
  process.exit(1);
}

console.log("Supabase URL:", supabaseUrl);
console.log(
  "Supabase Key (first 5 chars):",
  supabaseKey.substring(0, 5) + "...",
);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  console.log("Checking products table...");

  try {
    const { data, error, status } = await supabase
      .from("products")
      .select("*")
      .limit(1);

    console.log("Status:", status);

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      console.log("Products found:", data?.length || 0);
      if (data && data.length > 0) {
        console.log("Sample product:", data[0]);
      }
    }

    // Try to describe the database structure
    console.log("\nChecking for categories table...");
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .limit(1);

    if (categoriesError) {
      console.log("Categories table error:", categoriesError);

      if (categoriesError.code === "PGRST301") {
        console.log("Categories table does not exist. We need to create it.");
      }
    } else {
      console.log("Categories table exists with data:", categoriesData);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

checkProducts();
