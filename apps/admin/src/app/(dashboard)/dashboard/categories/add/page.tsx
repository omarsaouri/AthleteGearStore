"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/dashboard/category-form";

export default function AddCategoryPage() {
  const router = useRouter();

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
        <h1 className="text-2xl font-bold text-copy">Add New Category</h1>
      </div>

      <div className="bg-foreground p-6 rounded-lg border border-border">
        <CategoryForm mode="create" />
      </div>
    </div>
  );
}
