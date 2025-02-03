import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching product with ID:", params.id);

    if (!params.id) {
      console.log("Missing product ID");
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    console.log("Supabase response:", { product, error });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { message: "Failed to fetch product", error: error.message },
        { status: 500 }
      );
    }

    if (!product) {
      console.log("Product not found");
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    console.log("Successfully fetched product");
    return NextResponse.json(product);
  } catch (error) {
    console.error("Unexpected error in GET /api/products/[id]:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const { data: product, error } = await supabase
      .from("products")
      .update({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        sale_price: data.salePrice ? parseFloat(data.salePrice) : null,
        on_sale: data.onSale,
        category: data.category,
        inventory: parseInt(data.inventory),
        images: data.images,
        sizes: data.sizes,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
