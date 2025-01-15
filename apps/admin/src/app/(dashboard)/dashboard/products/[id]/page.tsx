"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
    if (!confirm("Are you sure you want to delete this product?")) return;

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
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-copy">Edit Product</h1>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center px-4 py-2 bg-error text-error-content rounded-md hover:bg-error-dark transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>
      <ProductForm initialData={product} mode="edit" />
    </div>
  );
}
