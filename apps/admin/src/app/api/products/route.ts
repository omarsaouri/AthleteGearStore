import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CreateProductData } from "@/lib/types/product";

export async function POST(req: Request) {
  try {
    const data: CreateProductData = await req.json();

    // Validate required fields
    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert product into database
    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          inventory: data.inventory,
          images: data.images,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { message: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
