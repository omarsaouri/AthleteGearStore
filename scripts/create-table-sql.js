// Script to create categories table using Supabase REST API
// Run with: node scripts/create-table-sql.js

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

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCategoriesTable() {
  console.log("Creating categories table...");

  try {
    // We'll use direct SQL via function or REST API
    const adminUrl = `${supabaseUrl}/rest/v1/`;

    // First try to fetch if the table already exists
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("count(*)", { count: "exact", head: true });
      if (!error) {
        console.log("Categories table already exists!");
        return insertCategories();
      }
    } catch (e) {
      console.log("Categories table does not exist, will create it");
    }

    // Now try to get the database via SQL Queries
    console.log("Attempting to create the categories table...");

    // This requires admin/service role key which we may not have
    // Instead, let's create the categories table manually in the Supabase dashboard
    console.log(
      "Please create the categories table manually in the Supabase dashboard with the following columns:",
    );
    console.log("- id: uuid (primary key, default: gen_random_uuid())");
    console.log("- name: text (not null)");
    console.log("- slug: text (not null, unique)");
    console.log("- description: text");
    console.log("- image_url: text");
    console.log("- created_at: timestamptz (default: now())");
    console.log("- updated_at: timestamptz (default: now())");
    console.log("\nThen add a column to the products table:");
    console.log("- category_id: uuid (foreign key to categories.id)");

    // Ask if table was created
    console.log(
      "\nAfter creating the table manually, run the following script to insert categories:",
    );
    console.log("node scripts/insert-categories.js");

    return;
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

async function insertCategories() {
  console.log("Inserting categories...");

  try {
    // Insert categories
    const initialCategories = [
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
      { name: "Equipment", slug: "equipment", description: "Sports equipment" },
    ];

    const { data, error } = await supabase
      .from("categories")
      .upsert(initialCategories, { onConflict: "slug" })
      .select();

    if (error) {
      console.error("Error inserting categories:", error);
      return;
    }

    console.log("✅ Categories inserted:", data);

    // Now link the products to categories
    console.log("Linking products to categories...");

    // First get all categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, slug");

    if (catError) {
      console.error("Error fetching categories:", catError);
      return;
    }

    // Create a lookup map
    const categoryMap = categories.reduce((map, cat) => {
      map[cat.slug] = cat.id;
      return map;
    }, {});

    // Now get all products
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id, category");

    if (prodError) {
      console.error("Error fetching products:", prodError);
      return;
    }

    // Update each product
    for (const product of products) {
      if (product.category && categoryMap[product.category]) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ category_id: categoryMap[product.category] })
          .eq("id", product.id);

        if (updateError) {
          console.error(`Error updating product ${product.id}:`, updateError);
        }
      }
    }

    console.log("✅ Products linked to categories");
  } catch (error) {
    console.error("Error in insertCategories:", error);
  }
}

createCategoriesTable();
