import Link from "next/link";
import { Package, ShoppingCart, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-copy mb-6">
            Athlete Gear Store Admin
          </h1>
          <p className="text-xl text-copy-light max-w-2xl mx-auto mb-12">
            Streamline your sports equipment inventory management, track orders,
            and grow your business with our comprehensive admin dashboard.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-foreground p-6 rounded-lg border border-border">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-copy mb-2">
              Inventory Management
            </h3>
            <p className="text-copy-light">
              Efficiently manage your sports equipment inventory with real-time
              tracking and alerts.
            </p>
          </div>

          <div className="bg-foreground p-6 rounded-lg border border-border">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-copy mb-2">
              Order Processing
            </h3>
            <p className="text-copy-light">
              Track and manage customer orders from placement to delivery with
              ease.
            </p>
          </div>

          <div className="bg-foreground p-6 rounded-lg border border-border">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-copy mb-2">
              Analytics & Reports
            </h3>
            <p className="text-copy-light">
              Get valuable insights into your sales, inventory, and business
              growth.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-foreground p-8 rounded-lg border border-border text-center">
          <h2 className="text-2xl font-bold text-copy mb-4">
            Ready to get started?
          </h2>
          <p className="text-copy-light mb-6">
            Login to your account or register as a new administrator.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex justify-center items-center px-6 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              Login to Dashboard
            </Link>
            <Link
              href="/register"
              className="inline-flex justify-center items-center px-6 py-3 bg-background text-copy border border-border rounded-md hover:bg-border transition-colors"
            >
              Register Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
