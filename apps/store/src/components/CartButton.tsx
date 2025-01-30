import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <button className="relative p-2">
      <ShoppingCart className="w-6 h-6 text-copy hover:text-primary transition-colors" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}
