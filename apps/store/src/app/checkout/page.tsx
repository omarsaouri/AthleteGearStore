"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push("/cart");
    }
  }, [items.length, router, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customerName: formData.get("firstName") + " " + formData.get("lastName"),
      customerPhone: formData.get("phone"),
      shippingAddress: formData.get("address"),
      items: items,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      clearCart();
      window.location.href = "/checkout/success";
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(t("checkout.error"));
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-copy mb-8">
          {t("checkout.title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-copy-light mb-2"
              >
                {t("checkout.firstName")}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="w-full px-3 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-copy"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-copy-light mb-2"
              >
                {t("checkout.lastName")}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="w-full px-3 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-copy"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-copy-light mb-2"
            >
              {t("checkout.phone")}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-copy"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-copy-light mb-2"
            >
              {t("checkout.address")}
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              className="w-full px-3 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-copy"
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
