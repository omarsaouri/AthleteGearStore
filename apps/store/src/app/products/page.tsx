"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getProducts } from "@/lib/api/products";
import { useCart } from "@/lib/context/CartContext";
import { toast } from "sonner";
import type { Product } from "@/lib/types/product";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(t("products.addedToCart"));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-copy text-center sm:text-left">
            {t("products.title")}
          </h1>
          <div className="w-full max-w-md mx-auto sm:mx-0">
            <div className="relative">
              <input
                type="text"
                placeholder={t("products.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy text-sm sm:text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-copy-light" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-foreground p-3 sm:p-4 rounded-lg border border-border animate-pulse"
              >
                <div className="w-full aspect-square bg-border rounded-md mb-3 sm:mb-4" />
                <div className="h-4 bg-border rounded w-3/4 mb-2" />
                <div className="h-4 bg-border rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-foreground p-3 sm:p-4 rounded-lg border border-border hover:border-primary transition-colors group cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <div className="aspect-square rounded-md bg-background mb-3 sm:mb-4 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-3 sm:p-4 transition-opacity duration-300"
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "1";
                      }}
                      style={{ opacity: 0 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-copy-light">
                      <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-copy mb-2 text-sm sm:text-base">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold text-sm sm:text-base">
                    {product.price.toFixed(2)} DH
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="px-2 sm:px-3 py-1 bg-primary text-primary-content rounded-md text-sm hover:bg-primary-light transition-all"
                  >
                    {t("products.addToCart")}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
