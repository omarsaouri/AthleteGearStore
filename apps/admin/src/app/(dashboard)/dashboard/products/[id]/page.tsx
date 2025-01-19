"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import ProductForm from "@/components/dashboard/product-form";
import type { Product } from "@/lib/types/product";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchProduct(resolvedParams.id);
    }
  }, [resolvedParams.id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Failed to load product");
      router.push("/dashboard/products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/products/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-border rounded-md animate-pulse" />
          <div className="h-10 w-36 bg-border rounded-md animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-border rounded-md animate-pulse" />
          <div className="h-12 bg-border rounded-md animate-pulse" />
          <div className="h-12 bg-border rounded-md animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-copy">Edit Product</h1>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="flex items-center px-4 py-2 bg-error text-error-content rounded-md hover:bg-error-dark transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
      <ProductForm initialData={product} mode="edit" />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-foreground border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-error mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Delete Product</h3>
            </div>

            <p className="text-copy-light mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-background text-copy border border-border rounded-md hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-error text-error-content rounded-md hover:bg-error-dark transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
