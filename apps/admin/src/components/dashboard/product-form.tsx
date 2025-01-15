"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import type { CreateProductData, Product } from "@/lib/types/product";

interface ProductFormProps {
  initialData?: Product;
  mode?: "create" | "edit";
}

export default function ProductForm({
  initialData,
  mode = "create",
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [formData, setFormData] = useState<CreateProductData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    inventory: initialData?.inventory || 0,
    images: initialData?.images || [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "inventory") {
      // Handle numeric inputs
      const numValue = value === "" ? 0 : parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      // Handle text inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setIsLoading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await response.json();
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      setFormData((prev) => ({ ...prev, images: newImages }));
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url =
        mode === "edit" ? `/api/products/${initialData?.id}` : "/api/products";

      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          mode === "edit"
            ? "Failed to update product"
            : "Failed to create product"
        );
      }

      toast.success(
        mode === "edit"
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      router.push("/dashboard/products");
    } catch (error) {
      toast.error(
        mode === "edit"
          ? "Failed to update product"
          : "Failed to create product"
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
          Name
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
          htmlFor="price"
          className="block text-sm font-medium text-copy-light"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-copy-light"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Select a category</option>
          <option value="clothing">Clothing</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="inventory"
          className="block text-sm font-medium text-copy-light"
        >
          Inventory
        </label>
        <input
          type="number"
          id="inventory"
          name="inventory"
          value={formData.inventory}
          onChange={handleInputChange}
          min="0"
          required
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-copy placeholder-copy-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-copy-light mb-2">
          Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="mt-1 block w-full text-copy"
        />
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg border border-border overflow-hidden bg-background"
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-error text-error-content opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-primary hover:bg-primary-light text-primary-content font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span>Loading...</span>
        ) : mode === "edit" ? (
          "Update Product"
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
}
