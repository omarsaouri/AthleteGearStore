// Script to insert categories into the categories table
// Run with: node scripts/insert-categories.js

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

    console.log(`Found ${products.length} products to update`);

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
      } else {
        console.log(
          `Product ${product.id} has category "${product.category}" which was not found in categories`,
        );
      }
    }

    console.log("✅ Products linked to categories");
  } catch (error) {
    console.error("Error in insertCategories:", error);
  }
}

insertCategories();
