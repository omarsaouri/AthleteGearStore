// Script to create the categories table in Supabase
// Run with: node scripts/create-categories-table.js

const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

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

async function setupCategoriesTable() {
  console.log("Setting up categories table...");

  try {
    // Create the categories table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Create index on slug for faster lookups
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
    `;

    // Execute SQL
    const { error: createTableError } = await supabase.rpc("postgres_execute", {
      query: createTableSQL,
    });

    if (createTableError) {
      console.error("Error creating categories table:", createTableError);
      throw createTableError;
    }

    console.log("✅ Categories table created successfully");

    // Add foreign key to products table
    const addForeignKeySQL = `
      -- First add category_id column if it doesn't exist
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'category_id'
        ) THEN
          ALTER TABLE public.products ADD COLUMN category_id UUID REFERENCES public.categories(id);
        END IF;
      END $$;
    `;

    const { error: foreignKeyError } = await supabase.rpc("postgres_execute", {
      query: addForeignKeySQL,
    });

    if (foreignKeyError) {
      console.error(
        "Error adding foreign key to products table:",
        foreignKeyError,
      );
      throw foreignKeyError;
    }

    console.log("✅ Foreign key added to products table");

    // Seed initial categories
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

    const { data: insertedCategories, error: seedError } = await supabase
      .from("categories")
      .upsert(initialCategories, { onConflict: "slug" })
      .select();

    if (seedError) {
      console.error("Error seeding initial categories:", seedError);
      throw seedError;
    }

    console.log(
      "✅ Initial categories seeded successfully:",
      insertedCategories,
    );

    // Update existing products to link to the new categories
    const updateProductsSQL = `
      -- Update existing products to link to the appropriate category
      UPDATE public.products p
      SET category_id = c.id
      FROM public.categories c
      WHERE p.category = c.slug AND p.category_id IS NULL;
    `;

    const { error: updateError } = await supabase.rpc("postgres_execute", {
      query: updateProductsSQL,
    });

    if (updateError) {
      console.error("Error updating existing products:", updateError);
      throw updateError;
    }

    console.log("✅ Existing products updated with category_id");

    console.log("🎉 Categories setup completed successfully");
  } catch (error) {
    console.error("Error setting up categories:", error);
    process.exit(1);
  }
}

setupCategoriesTable();
