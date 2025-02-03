"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Image as ImageIcon,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Product } from "@/lib/types/product";
import { toast } from "sonner";
import Link from "next/link";
import DeleteConfirmation from "@/components/dashboard/DeleteConfirmation";
import StockWarning from "@/components/dashboard/StockWarning";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update low stock products whenever products change
    const outOfStock = products.filter((product) => product.inventory === 0);
    setLowStockProducts(outOfStock);
  }, [products]);

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

  const handleDelete = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-foreground p-4 rounded-lg border border-border animate-pulse"
          >
            <div className="h-6 bg-border rounded w-1/4 mb-4" />
            <div className="h-4 bg-border rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-[100vw] overflow-x-hidden px-4 sm:px-6">
      {lowStockProducts.length > 0 && (
        <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg">
          <div className="flex items-center gap-2 text-error mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-medium">Out of Stock Products</h3>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="text-sm text-copy-light">
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-copy">Products</h1>
        <Link
          href="/dashboard/products/add"
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
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

      {filteredProducts.length === 0 ? (
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
            <Link
              href="/dashboard/products/add"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Link>
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

              <StockWarning inventory={product.inventory} />

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-background text-copy border border-border rounded-md hover:border-primary transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductToDelete(product);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-background text-error border border-error rounded-md hover:bg-error hover:text-error-content transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmation
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => productToDelete && handleDelete(productToDelete)}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
}
