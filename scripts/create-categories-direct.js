// Script to create categories directly in Supabase
// Run with: node scripts/create-categories-direct.js

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

async function createCategories() {
  console.log("Creating categories...");

  try {
    // Create categories directly
    const initialCategories = [
      {
        name: "Clothing",
        slug: "clothing",
        description: "Athletic clothing and apparel",
        priority: 10,
      },
      {
        name: "Shoes",
        slug: "shoes",
        description: "Athletic footwear",
        priority: 20,
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Sports accessories and gear",
        priority: 5,
      },
      {
        name: "Equipment",
        slug: "equipment",
        description: "Sports equipment",
        priority: 15,
      },
    ];

    const { data: categories, error } = await supabase
      .from("categories")
      .upsert(initialCategories, { onConflict: "slug" })
      .select();

    if (error) {
      console.error("Error creating categories:", error);
      throw error;
    }

    console.log("✅ Categories created successfully:", categories);

    // Now update the existing products to link to these categories
    console.log("Fetching categories to update products...");
    const { data: allCategories, error: fetchError } = await supabase
      .from("categories")
      .select("*");

    if (fetchError) {
      console.error("Error fetching categories:", fetchError);
      return;
    }

    // Create a mapping from slug to ID
    const categoryMap = allCategories.reduce((map, category) => {
      map[category.slug] = category.id;
      return map;
    }, {});

    console.log("Fetching products to update...");
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, category");

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return;
    }

    console.log(`Found ${products.length} products to update`);

    // Update each product with the corresponding category_id
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

    console.log("✅ Products updated with category_id");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createCategories();
