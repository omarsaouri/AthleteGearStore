"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/lib/types/product";

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product & { selectedSize?: string }) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product & { selectedSize?: string }) => {
    setItems((currentItems) => {
      const price =
        product.onSale && product.salePrice ? product.salePrice : product.price;

      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, price, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize?: string
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
