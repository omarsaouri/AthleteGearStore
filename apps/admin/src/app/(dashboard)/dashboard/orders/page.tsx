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
  Mail,
  Phone,
  MapPin,
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setOrders(data);
    } catch (error) {
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
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-foreground p-6 rounded-lg border border-border animate-pulse"
          >
            <div className="h-6 bg-border rounded w-1/4 mb-4" />
            <div className="h-4 bg-border rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-copy mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-copy-light" />
            <h3 className="mt-4 text-lg font-medium text-copy">
              No orders found
            </h3>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-foreground p-6 rounded-lg border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-copy">
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
                    transition-colors duration-200
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-copy-light">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{order.shippingAddress}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <p className="text-copy">
                          {item.productName} ({item.quantity}x)
                        </p>
                        <p className="font-medium text-copy">
                          ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between">
                        <p className="font-medium text-copy">Total</p>
                        <p className="font-bold text-primary">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
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
