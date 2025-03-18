import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET() {
  try {
    console.log("Fetching categories from Supabase (store app)...");

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log(`Successfully fetched ${categories?.length || 0} categories`);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return the actual error message for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Failed to fetch categories", error: errorMessage },
      { status: 500 },
    );
  }
}
