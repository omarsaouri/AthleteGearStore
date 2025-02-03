"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, GripVertical } from "lucide-react";
import type { CreateProductData, Product } from "@/lib/types/product";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProductFormProps {
  initialData?: Product;
  mode?: "create" | "edit";
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

type DragEvent = React.DragEvent<HTMLDivElement>;

// Create a SortableImage component
function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: url,
    data: {
      index,
      url,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-lg border ${
        isDragging
          ? "border-primary bg-base-200/80 z-10 scale-105"
          : "border-border bg-base-200/50"
      } group overflow-hidden hover:border-primary transition-all touch-none`}
    >
      <img
        src={url}
        alt={`Product ${index + 1}`}
        className="h-full w-full object-contain p-2 select-none"
        draggable={false}
      />
      <div
        className={`absolute inset-0 ${isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity bg-background/5`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-error/90 text-error-content hover:bg-error transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-2 rounded-full bg-background/80 text-copy cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        {index === 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-primary/90 text-primary-content text-xs">
            Main Image
          </div>
        )}
      </div>
    </div>
  );
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
    price: initialData?.price?.toString() || "0",
    salePrice: initialData?.salePrice?.toString() || "",
    onSale: initialData?.onSale || false,
    category: initialData?.category || "",
    inventory: initialData?.inventory?.toString() || "0",
    images: initialData?.images || [],
    sizes: initialData?.sizes || [],
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price" || name === "inventory") {
      // Only convert to number when submitting the form
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
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

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);

      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      setIsLoading(true);

      // Convert price and inventory to numbers before sending
      const submissionData = {
        ...formData,
        price: formData.price === "" ? 0 : parseFloat(formData.price as string),
        inventory:
          formData.inventory === ""
            ? 0
            : parseInt(formData.inventory as string),
      };

      const url =
        mode === "edit" ? `/api/products/${initialData?.id}` : "/api/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-copy-light mb-2">
            Regular Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-copy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-copy-light mb-2">
            Sale Price (Optional)
          </label>
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-copy"
          />
        </div>
      </div>

      <div className="bg-base-200/50 rounded-lg">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="onSale"
            checked={formData.onSale}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, onSale: e.target.checked }))
            }
            className="peer sr-only"
          />
          <div className="relative h-5 w-5 border border-border rounded bg-background transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/20">
            <svg
              className={`h-4 w-4 text-primary-content stroke-2 absolute left-0.5 top-0.5 ${
                formData.onSale ? "block" : "hidden"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-sm text-copy">Mark as on sale</span>
        </label>
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

      <div className="space-y-3">
        <label className="block text-sm font-medium text-copy-light">
          Images
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-base-200/50 hover:bg-base-200 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-copy-light"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-copy-light">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-copy-light/75">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        {images.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-copy-light mb-2">
              <span className="hidden sm:inline">Drag and drop or </span>
              <span className="sm:hidden">Press and hold the grip handle </span>
              to reorder images. First image will be the main product image.
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              autoScroll={true}
            >
              <SortableContext
                items={images}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <SortableImage
                      key={image}
                      url={image}
                      index={index}
                      onRemove={() => removeImage(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-copy-light mb-2">
          Available Sizes
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.sizes.includes(size)
                  ? "bg-primary text-primary-content"
                  : "bg-background text-copy border border-border hover:border-primary"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
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
