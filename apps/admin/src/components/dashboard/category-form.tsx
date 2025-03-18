"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Category, CreateCategoryData } from "@/lib/types/category";
import { createCategory, updateCategory } from "@/lib/api/categories";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  initialData?: Category;
  mode?: "create" | "edit";
}

export default function CategoryForm({
  initialData,
  mode = "create",
}: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    priority: initialData?.priority || 0,
  });

  // Generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug && mode === "create") {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, formData.slug, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Handle priority as a number
    if (name === "priority") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "edit" && initialData) {
        await updateCategory(initialData.id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        `Failed to ${mode === "edit" ? "update" : "create"} category`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-copy-light"
        >
          Name<span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-copy-light"
        >
          Slug<span className="text-error">*</span>
          <span className="text-xs text-copy-light ml-2">
            (Used in URLs, auto-generated from name)
          </span>
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-copy-light"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-copy-light"
        >
          Priority
          <span className="text-xs text-copy-light ml-2">
            (Higher number = higher priority in display order)
          </span>
        </label>
        <input
          type="number"
          id="priority"
          name="priority"
          value={formData.priority || 0}
          onChange={handleInputChange}
          min="0"
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
            {mode === "edit" ? "Updating..." : "Creating..."}
          </>
        ) : mode === "edit" ? (
          "Update Category"
        ) : (
          "Create Category"
        )}
      </button>
    </form>
  );
}
