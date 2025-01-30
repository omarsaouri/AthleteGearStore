"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toast } from "sonner";

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { items, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: `${form.firstName} ${form.lastName}`,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: form.address,
          items: items.map((item) => ({
            product_id: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: totalAmount,
          status: "pending",
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      // First clear the cart
      clearCart();
      // Show success message
      toast.success(t("checkout.success"));
      // Wait a moment before redirecting
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Then redirect
      window.location.href = "/checkout/success";
    } catch (error) {
      toast.error(t("checkout.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-copy mb-8">
          {t("checkout.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-copy mb-2">
                {t("checkout.firstName")}
              </label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className="w-full px-4 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-copy mb-2">
                {t("checkout.lastName")}
              </label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-copy mb-2">
              {t("checkout.email")}
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-copy mb-2">
              {t("checkout.phone")}
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-copy mb-2">
              {t("checkout.address")}
            </label>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
            />
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex justify-between mb-4">
              <span className="text-copy">{t("checkout.total")}</span>
              <span className="text-primary font-bold">
                {totalAmount.toFixed(2)} DH
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? t("checkout.processing")
                : t("checkout.placeOrder")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
