import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch all orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*");

    if (ordersError) throw ordersError;

    // Fetch total products
    const { count: totalProducts, error: productsError } = await supabase
      .from("products")
      .select("*", { count: "exact" });

    if (productsError) throw productsError;

    // Calculate stats
    const totalOrders = orders?.length || 0;
    const totalSales =
      orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    // Calculate growth rate (comparing current month to previous month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthOrders = orders?.filter((order) => {
      const orderDate = new Date(order.created_at);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });

    const previousMonthOrders = orders?.filter((order) => {
      const orderDate = new Date(order.created_at);
      return (
        orderDate.getMonth() === currentMonth - 1 &&
        orderDate.getFullYear() === currentYear
      );
    });

    const currentMonthSales =
      currentMonthOrders?.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      ) || 0;

    const previousMonthSales =
      previousMonthOrders?.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      ) || 0;

    const growthRate =
      previousMonthSales === 0
        ? 100
        : ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalProducts,
      growthRate: Number(growthRate.toFixed(1)),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
