import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET() {
  try {
    // Fetch products with their associated categories
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch all categories to get their priorities
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

    if (categoriesError) throw categoriesError;

    // Create a map of category IDs to their priorities for quick lookup
    const categoryPriorityMap = new Map();
    categories.forEach((category) => {
      categoryPriorityMap.set(category.id, category.priority || 0);
    });

    // Sort products by their category priority
    const sortedProducts = [...products].sort((a, b) => {
      const categoryA = a.categories;
      const categoryB = b.categories;

      const priorityA = categoryA
        ? categoryPriorityMap.get(categoryA.id) || 0
        : 0;
      const priorityB = categoryB
        ? categoryPriorityMap.get(categoryB.id) || 0
        : 0;

      // Higher priority categories come first
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      // If categories have the same priority, sort by product creation date (newest first)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
