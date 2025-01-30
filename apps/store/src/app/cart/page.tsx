"use client";

import { useCart } from "@/lib/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-copy mb-4">
            {t("cart.empty")}
          </h1>
          <p className="text-copy-light mb-8">{t("cart.emptyMessage")}</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-copy mb-8">{t("cart.title")}</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-foreground p-4 rounded-lg border border-border"
            >
              <div className="grid grid-cols-[80px_1fr_auto_auto] sm:grid-cols-[80px_2fr_auto_auto] items-center gap-4">
                <div className="w-20 h-20 bg-background rounded-md overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="font-medium text-copy line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-primary font-semibold">
                    {item.price.toFixed(2)} DH
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="p-1 hover:bg-background rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-background rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 hover:bg-background rounded"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-foreground p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-6">
            <span className="text-copy font-medium">{t("cart.total")}</span>
            <span className="text-primary font-bold text-xl">
              {totalAmount.toFixed(2)} DH
            </span>
          </div>
          <Link
            href="/checkout"
            className="w-full py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors inline-block text-center"
          >
            {t("cart.checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}
