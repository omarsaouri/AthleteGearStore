import { supabase } from "@/lib/supabase";
import type { OrderItem } from "@/lib/types/order";

export async function updateInventory(
  items: OrderItem[],
  increase: boolean = false
) {
  try {
    for (const item of items) {
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("inventory")
        .eq("id", item.productId)
        .single();

      if (fetchError) throw fetchError;

      const newInventory = increase
        ? product.inventory + item.quantity
        : product.inventory - item.quantity;

      const { error: updateError } = await supabase
        .from("products")
        .update({ inventory: newInventory })
        .eq("id", item.productId);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error("Error updating inventory:", error);
    throw error;
  }
}
