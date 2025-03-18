"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/lib/types/category";
import { toast } from "sonner";
import DeleteConfirmation from "@/components/dashboard/DeleteConfirmation";
import { getCategories, deleteCategory } from "@/lib/api/categories";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [relatedProductsCount, setRelatedProductsCount] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast.success("Category deleted successfully");
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      setRelatedProductsCount(0);
    } catch (error: unknown) {
      console.error("Error deleting category:", error);

      // Parse the error response
      if (typeof error === "object" && error !== null) {
        // Handle structured error from API
        if ("message" in error) {
          const errMessage = (error as { message: string }).message;
          if (errMessage.includes("in use by")) {
            // Extract product count from error message
            const countMatch = errMessage.match(/in use by (\d+) products/);
            const count = countMatch ? parseInt(countMatch[1]) : 0;

            setRelatedProductsCount(count);

            if (count > 0) {
              toast.error(
                `Cannot delete category. It is used by ${count} products.`,
              );
            } else {
              toast.error(
                "Cannot delete this category. It is used by products.",
              );
            }
          } else {
            toast.error("Failed to delete category");
          }
        } else {
          toast.error("Failed to delete category");
        }
      } else {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleEdit = (category: Category) => {
    router.push(`/dashboard/categories/edit/${category.id}`);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-copy">Categories</h1>
        <button
          onClick={() => router.push("/dashboard/categories/add")}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-copy"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-copy-light" />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-lg font-medium text-copy mb-2">
            {searchTerm ? "No categories found" : "No categories added yet"}
          </h3>
          <p className="text-copy-light mb-4">
            {searchTerm
              ? "Try adjusting your search"
              : "Get started by adding your first category"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => router.push("/dashboard/categories/add")}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="py-3 px-4 text-left text-copy-light font-medium">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-copy-light font-medium">
                  Slug
                </th>
                <th className="py-3 px-4 text-left text-copy-light font-medium">
                  Priority
                </th>
                <th className="py-3 px-4 text-left text-copy-light font-medium">
                  Description
                </th>
                <th className="py-3 px-4 text-right text-copy-light font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border hover:bg-background/50"
                >
                  <td className="py-3 px-4 text-copy">{category.name}</td>
                  <td className="py-3 px-4 text-copy-light">{category.slug}</td>
                  <td className="py-3 px-4 text-copy-light">
                    {category.priority || 0}
                  </td>
                  <td className="py-3 px-4 text-copy-light line-clamp-1">
                    {category.description || "No description"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1.5 bg-foreground text-copy rounded-md hover:bg-background transition-colors"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-1.5 bg-foreground text-error rounded-md hover:bg-background transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={
          relatedProductsCount > 0
            ? `This category is used by ${relatedProductsCount} products. You need to reassign these products before deleting this category.`
            : `Are you sure you want to delete the category "${categoryToDelete?.name}"?`
        }
        confirmLabel={relatedProductsCount > 0 ? "OK" : "Delete"}
        disabled={relatedProductsCount > 0}
      />
    </div>
  );
}
