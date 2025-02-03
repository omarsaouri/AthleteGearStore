import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { updateInventory } from "@/lib/inventory/updateInventory";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    // Get the current order to check previous status
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError) throw fetchError;

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Handle inventory updates
    if (status === "delivered" && currentOrder.status !== "delivered") {
      // Decrease inventory when order is marked as delivered
      await updateInventory(order.items);
    } else if (currentOrder.status === "delivered" && status !== "delivered") {
      // Increase inventory when order is un-marked as delivered
      await updateInventory(order.items, true);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
