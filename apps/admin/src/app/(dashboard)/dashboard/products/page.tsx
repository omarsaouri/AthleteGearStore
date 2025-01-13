"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-copy">Products</h1>
        <button
          onClick={() => router.push("/dashboard/products/add")}
          className="flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-foreground p-4 rounded-lg border border-border animate-pulse"
            >
              <div className="w-full h-48 bg-border rounded-md mb-4" />
              <div className="h-6 bg-border rounded w-3/4 mb-2" />
              <div className="h-4 bg-border rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-copy mb-2">
            No products found
          </h3>
          <p className="text-copy-light mb-4">
            Get started by adding your first product
          </p>
          <button
            onClick={() => router.push("/dashboard/products/add")}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-foreground p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/products/${product.id}`)}
            >
              {product.images && product.images.length > 0 ? (
                <div className="w-full h-48 relative bg-background">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-md"
                    onError={(e) => {
                      console.error(
                        `Failed to load image for product: ${product.name}`,
                        product.images[0]
                      );
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAwdjI0aC0yNHYtMjRoMjR6bS0yMiAzdjE4aDE0di0xOGgtMTR6bTE2IDBoM3YxOGgtM3YtMTh6Ii8+PC9zdmc+"; // Simple placeholder SVG
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-border rounded-md mb-4 flex items-center justify-center text-copy-light">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    No Image
                  </span>
                </div>
              )}
              <h3 className="font-medium text-copy mb-2">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-primary font-medium">
                  ${product.price.toFixed(2)}
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
