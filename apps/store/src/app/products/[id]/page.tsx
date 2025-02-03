"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/context/CartContext";
import { toast } from "sonner";
import type { Product } from "@/lib/types/product";

export default function ProductDetailsPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
        // Initialize with first size if available
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Check if product has sizes and requires size selection
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      ...product,
      selectedSize,
    });
    toast.success("Added to cart");
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      previousImage();
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-border rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-border rounded w-3/4" />
                <div className="h-6 bg-border rounded w-1/4" />
                <div className="h-24 bg-border rounded w-full" />
                <div className="h-12 bg-border rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-copy hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("products.backToProducts")}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div
            ref={imageRef}
            className="aspect-square bg-foreground rounded-lg border border-border p-4 relative group touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain transition-opacity duration-300 select-none"
                  draggable={false}
                />
                {product.images.length > 1 && (
                  <>
                    {/* Show navigation arrows only on non-touch devices */}
                    <div className="hidden sm:block">
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-copy opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 text-copy opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Image counter for mobile */}
                    <div className="absolute top-2 right-2 sm:hidden bg-background/80 px-2 py-1 rounded-full text-xs text-copy">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>

                    {/* Dots indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 touch-none">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentImageIndex === index
                              ? "bg-primary w-4"
                              : "bg-copy-light/50 hover:bg-copy-light"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-copy-light">
                <ShoppingBag className="w-16 h-16" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-copy mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-primary mb-6">
              {product.price.toFixed(2)} DH
            </p>
            <p className="text-copy-light mb-8">{product.description}</p>

            {/* Only show sizes section if product has sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-copy">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm font-medium rounded-md border ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-content"
                          : "border-border text-copy hover:border-primary"
                      } transition-colors`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto mt-8 px-6 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              {t("products.addToCart")}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
