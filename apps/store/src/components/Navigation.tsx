"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe2, ShoppingBag, ShoppingCart, Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/context/CartContext";
import { Logo } from "@/components/Logo";

export default function Navigation() {
  const { language, setLanguage } = useLanguage();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/products"
              className="flex items-center px-3 py-2 text-copy hover:text-primary transition-colors"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {language === "en" ? "Products" : "Produits"}
            </Link>
            <Link
              href="/cart"
              className="flex items-center px-3 py-2 text-copy hover:text-primary transition-colors relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {language === "en" ? "Cart" : "Panier"}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className="flex items-center px-3 py-2 text-copy hover:text-primary transition-colors"
            >
              <Globe2 className="w-4 h-4 mr-2" />
              {language.toUpperCase()}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href="/cart"
              className="flex items-center p-2 text-copy hover:text-primary transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-copy hover:text-primary transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-background border-b border-border z-50">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/products"
              className="flex items-center px-3 py-3 text-copy hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              {language === "en" ? "Products" : "Produits"}
            </Link>
            <button
              onClick={() => {
                setLanguage(language === "fr" ? "en" : "fr");
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-3 text-copy hover:text-primary transition-colors"
            >
              <Globe2 className="w-5 h-5 mr-3" />
              {language === "en" ? "Change Language" : "Changer de langue"} (
              {language.toUpperCase()})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
