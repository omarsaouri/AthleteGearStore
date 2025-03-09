"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types/order";

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type FilterOption = "all" | "active" | "completed" | "cancelled";

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "active", label: "Active Orders" },
  { value: "completed", label: "Completed Orders" },
  { value: "cancelled", label: "Cancelled Orders" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<FilterOption>("active");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = orders.filter((order) => {
    switch (filterType) {
      case "active":
        return ["pending", "processing", "shipped"].includes(order.status);
      case "completed":
        return order.status === "delivered";
      case "cancelled":
        return order.status === "cancelled";
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-foreground p-4 sm:p-6 rounded-lg border border-border animate-pulse"
          >
            <div className="h-6 bg-border rounded w-1/4 mb-4" />
            <div className="h-4 bg-border rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-copy">Orders</h1>

        <div className="relative w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-foreground border border-border rounded-md px-4 py-3 sm:py-2 w-full sm:w-auto cursor-pointer">
            <Filter className="w-5 h-5 sm:w-4 sm:h-4 text-copy-light" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterOption)}
              className="appearance-none bg-transparent text-copy w-full sm:w-auto text-base sm:text-sm focus:outline-none cursor-pointer"
            >
              {filterOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-foreground text-copy"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 sm:w-4 sm:h-4 text-copy-light ml-auto sm:ml-2" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-foreground rounded-lg border border-border">
            <AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-copy-light" />
            <h3 className="mt-4 text-base sm:text-lg font-medium text-copy">
              {filterType === "all"
                ? "No orders found"
                : filterType === "active"
                  ? "No active orders"
                  : filterType === "completed"
                    ? "No completed orders"
                    : "No cancelled orders"}
            </h3>
            {filterType !== "all" && (
              <p className="mt-2 text-copy-light">
                Try changing the filter to see different orders
              </p>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-foreground p-4 sm:p-6 rounded-lg border border-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-copy">
                    {order.customerName}
                  </h3>
                  <p className="text-copy-light text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value as OrderStatus)
                  }
                  className={`${
                    statusColors[order.status]
                  } px-3 py-1.5 rounded-full text-sm font-medium appearance-none cursor-pointer
                    border-2 border-transparent hover:border-opacity-50 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
                    transition-colors duration-200 w-full sm:w-auto
                    pr-8 relative bg-no-repeat bg-[right_0.5rem_center]`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundSize: "1.1rem",
                  }}
                >
                  {Object.keys(statusIcons).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-3 mb-4 text-sm text-copy-light">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{order.shippingAddress}</span>
                </div>
              </div>

              <button
                onClick={() => toggleOrderExpansion(order.id)}
                className="w-full py-2 flex items-center justify-center gap-2 text-sm text-copy-light hover:bg-background rounded-md transition-colors sm:hidden"
              >
                {expandedOrders.has(order.id) ? "Hide Details" : "Show Details"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedOrders.has(order.id) ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`border-t border-border pt-4 ${
                  !expandedOrders.has(order.id) ? "hidden sm:block" : ""
                }`}
              >
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm sm:text-base"
                    >
                      <div className="flex-1">
                        <p className="text-copy">
                          {item.productName} ({item.quantity}x)
                          {item.selectedSize && (
                            <span className="ml-2 text-copy-light">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="font-medium text-copy ml-4">
                        {(item.quantity * item.price).toFixed(2)} DH
                      </p>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <p className="font-medium text-copy">Total</p>
                      <p className="font-bold text-primary">
                        {order.totalAmount.toFixed(2)} DH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
