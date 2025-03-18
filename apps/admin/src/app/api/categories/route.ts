import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("Fetching categories from Supabase...");

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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create a slug from the name if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
    }

    const { data: category, error } = await supabase
      .from("categories")
      .insert([
        {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          priority: data.priority || 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    // Create a slug from the name if not provided
    if (!updateData.slug && updateData.name) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
    }

    const { data: category, error } = await supabase
      .from("categories")
      .update({
        name: updateData.name,
        slug: updateData.slug,
        description: updateData.description || null,
        priority:
          updateData.priority !== undefined ? updateData.priority : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 },
    );
  }
}
