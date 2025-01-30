import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          shipping_address: data.shipping_address,
          items: data.items,
          total_amount: data.total_amount,
          status: data.status,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
