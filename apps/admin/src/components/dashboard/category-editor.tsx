"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CategoryForm from "@/components/dashboard/category-form";
import { getCategory } from "@/lib/api/categories";
import { Category } from "@/lib/types/category";

// Client component that handles the state and UI
export default function CategoryEditor({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const data = await getCategory(categoryId);
        setCategory(data);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category");
        router.push("/dashboard/categories");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-copy-light">Loading category...</p>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-foreground transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-copy">Edit Category</h1>
      </div>

      <div className="bg-foreground p-6 rounded-lg border border-border">
        <CategoryForm initialData={category} mode="edit" />
      </div>
    </div>
  );
}
