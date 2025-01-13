"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    growthRate: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from your API
    // Simulated API call
    setTimeout(() => {
      setStats({
        totalSales: 15420,
        totalOrders: 125,
        totalProducts: 48,
        growthRate: 12.5,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

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

      {/* Placeholder for future components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-foreground p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-copy mb-4">
            Recent Orders
          </h2>
          <p className="text-copy-light">Coming soon...</p>
        </div>

        <div className="bg-foreground p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-copy mb-4">
            Popular Products
          </h2>
          <p className="text-copy-light">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
