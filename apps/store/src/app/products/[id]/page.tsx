"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/context/CartContext";
import { toast } from "sonner";
import type { Product } from "@/lib/types/product";

export default function ProductDetailsPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        toast.error(t("products.notFound"));
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [params.id, router, t]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success(t("products.addedToCart"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-border rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-border rounded w-3/4" />
                <div className="h-6 bg-border rounded w-1/4" />
                <div className="h-24 bg-border rounded w-full" />
                <div className="h-12 bg-border rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-copy hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("products.backToProducts")}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="aspect-square bg-foreground rounded-lg border border-border p-4">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-copy-light">
                <ShoppingBag className="w-16 h-16" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-copy mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary mb-6">
              {product.price.toFixed(2)} DH
            </p>
            <p className="text-copy-light mb-8">{product.description}</p>
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              {t("products.addToCart")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
