import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/lib/context/CartContext";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { customerName, customerPhone, shippingAddress, items } = data;

    // Validate required fields
    if (!customerName || !customerPhone || !shippingAddress || !items) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderItems = items.map((item: CartItem) => ({
      product_id: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      selectedSize: item.selectedSize || null,
      image: item.images?.[0] || null,
    }));

    const totalAmount = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const { data: order, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          items: orderItems,
          total_amount: totalAmount,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
