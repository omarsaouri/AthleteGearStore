"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Image as ImageIcon, Search } from "lucide-react";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[100vw] overflow-x-hidden px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-copy">Products</h1>
        <button
          onClick={() => router.push("/dashboard/products/add")}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-copy-light" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-foreground p-4 rounded-lg border border-border animate-pulse"
            >
              <div className="w-full aspect-square bg-border rounded-md mb-4" />
              <div className="h-6 bg-border rounded w-3/4 mb-2" />
              <div className="h-4 bg-border rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-lg font-medium text-copy mb-2">
            {searchTerm ? "No products found" : "No products added yet"}
          </h3>
          <p className="text-copy-light mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first product"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => router.push("/dashboard/products/add")}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-foreground p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
              onClick={() => router.push(`/dashboard/products/${product.id}`)}
            >
              {product.images && product.images.length > 0 ? (
                <div className="w-full aspect-square relative bg-background rounded-md">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "fallback-image-url";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-border rounded-md flex items-center justify-center text-copy-light">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    No Image
                  </span>
                </div>
              )}
              <h3 className="font-medium text-copy mt-3 mb-2 line-clamp-1">
                {product.name}
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">
                  {product.price.toFixed(2)} DH
                </span>
                <span className="text-copy-light text-sm">
                  Stock: {product.inventory}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
