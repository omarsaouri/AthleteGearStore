import { AlertCircle } from "lucide-react";

export default function StockWarning({ inventory }: { inventory: number }) {
  if (inventory > 0) return null;

  return (
    <div className="flex items-center gap-2 text-error mt-2">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm font-medium">Out of stock</span>
    </div>
  );
}
