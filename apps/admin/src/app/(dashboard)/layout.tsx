"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
}

function NavLink({ href, icon: Icon, children, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
        isActive
          ? "bg-primary text-primary-content"
          : "text-copy hover:bg-primary/10"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {children}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Force a hard reload to clear any client state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="h-full flex bg-background">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-0 w-full lg:w-72 z-50 transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 bg-foreground flex flex-col border-r border-border`}
      >
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-bold text-copy">Admin</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-background rounded-md text-copy ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              isActive={
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname?.startsWith(link.href)
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-copy hover:bg-primary/10 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 min-h-full w-full">
        <header className="sticky top-0 z-30 h-16 bg-foreground border-b border-border">
          <div className="h-full flex items-center px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-background rounded-md text-copy"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
