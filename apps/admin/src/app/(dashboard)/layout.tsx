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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-foreground border-r border-border w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-copy">Admin</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-copy"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
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

          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-copy hover:bg-primary/10 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`lg:ml-64 transition-margin ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="bg-foreground border-b border-border">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden text-copy ${isSidebarOpen ? "hidden" : ""}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
