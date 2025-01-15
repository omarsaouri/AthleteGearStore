import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("Starting orders fetch...");

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("Supabase response:", { orders, error });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!orders) {
      console.log("No orders found");
      return NextResponse.json([]);
    }

    const transformedOrders = orders.map((order) => {
      console.log("Processing order:", order);
      return {
        id: order.id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        items: order.items,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      };
    });

    console.log("Transformed orders:", transformedOrders);

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
