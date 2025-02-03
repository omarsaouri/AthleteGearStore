import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CreateProductData } from "@/lib/types/product";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          sale_price: data.salePrice ? parseFloat(data.salePrice) : null,
          on_sale: data.onSale,
          category: data.category,
          inventory: parseInt(data.inventory),
          images: data.images,
          sizes: data.sizes,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name: updateData.name,
        description: updateData.description,
        price: parseFloat(updateData.price),
        sale_price: updateData.salePrice
          ? parseFloat(updateData.salePrice)
          : null,
        on_sale: updateData.onSale,
        category: updateData.category,
        inventory: parseInt(updateData.inventory),
        images: updateData.images,
        sizes: updateData.sizes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
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
