import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if any products use this category
    const { data: products, error: checkError } = await supabase
      .from("products")
      .select("id")
      .eq("category_id", id);

    if (checkError) throw checkError;

    // If products are using this category, don't allow deletion
    if (products && products.length > 0) {
      console.log(
        `Category ${id} is used by ${products.length} products, preventing deletion`,
      );
      return NextResponse.json(
        {
          message: `Cannot delete category because it is in use by ${products.length} products. Please reassign these products to another category first.`,
          productsCount: products.length,
        },
        { status: 400 },
      );
    }

    // Delete the category
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error during category deletion:", error);
    return NextResponse.json(
      { message: "Failed to delete category", error: String(error) },
      { status: 500 },
    );
  }
}
