import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data: product, error } = await supabase
      .from("products")
      .select("*, categories(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
