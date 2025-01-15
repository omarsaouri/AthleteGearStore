"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Product } from "@/lib/types/product";
import type { Order } from "@/lib/types/order";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    growthRate: 0,
  });
  const [lowInventoryProducts, setLowInventoryProducts] = useState<Product[]>(
    []
  );
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([fetchStats(), fetchAlerts()]);
  }, []);

  const fetchStats = async () => {
    // Keeping the existing stats logic for now
    setTimeout(() => {
      setStats({
        totalSales: 15420,
        totalOrders: 125,
        totalProducts: 48,
        growthRate: 12.5,
      });
      setIsLoading(false);
    }, 1000);
  };

  const fetchAlerts = async () => {
    try {
      // Fetch products and filter for low inventory
      const productsResponse = await fetch("/api/products");
      if (!productsResponse.ok) throw new Error("Failed to fetch products");
      const products: Product[] = await productsResponse.json();
      setLowInventoryProducts(products.filter((p) => p.inventory < 10));

      // Fetch orders and filter for pending
      const ordersResponse = await fetch("/api/orders");
      if (!ordersResponse.ok) throw new Error("Failed to fetch orders");
      const orders: Order[] = await ordersResponse.json();
      setPendingOrders(orders.filter((o) => o.status === "pending"));
    } catch (error) {
      toast.error("Failed to load alerts");
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    loading,
  }: {
    title: string;
    value: string | number;
    icon: any;
    loading: boolean;
  }) => (
    <div className="bg-foreground p-6 rounded-lg border border-border">
      <div className="flex items-center">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-copy-light">{title}</p>
          {loading ? (
            <div className="h-6 w-24 bg-border animate-pulse rounded mt-1" />
          ) : (
            <p className="text-xl font-semibold text-copy">{value}</p>
          )}
        </div>
      </div>
    </div>
  );

  const AlertSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-foreground p-6 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-semibold text-copy">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-copy mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBag}
          loading={isLoading}
        />
        <StatCard
          title="Growth Rate"
          value={`${stats.growthRate}%`}
          icon={TrendingUp}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertSection title="Low Inventory Products">
          {lowInventoryProducts.length === 0 ? (
            <p className="text-copy-light">No products with low inventory</p>
          ) : (
            <div className="space-y-3">
              {lowInventoryProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}`}
                  className="block p-3 rounded-md bg-background hover:bg-border transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-copy">{product.name}</p>
                      <p className="text-sm text-copy-light">
                        Only {product.inventory} items left
                      </p>
                    </div>
                    <span className="text-warning font-medium">Low Stock</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AlertSection>

        <AlertSection title="Pending Orders">
          {pendingOrders.length === 0 ? (
            <p className="text-copy-light">No pending orders</p>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/dashboard/orders"
                  className="block p-3 rounded-md bg-background hover:bg-border transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-copy">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-copy-light">
                        ${order.totalAmount.toFixed(2)} - {order.items.length}{" "}
                        items
                      </p>
                    </div>
                    <span className="text-warning font-medium">
                      Pending Review
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AlertSection>
      </div>
    </div>
  );
}
