import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Inter, Montserrat } from "next/font/google";
import { CartProvider } from "@/lib/context/CartContext";
import Navigation from "@/components/Navigation";
import { Toaster, ToasterProps } from "sonner";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Athlete's Gear Store",
  description: "Your E-commerce Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#1a1b1e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="h-full bg-background">
        <CartProvider>
          <LanguageProvider>
            <div className="min-h-full flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster
              theme="dark"
              position="bottom-right"
              richColors
              toastOptions={{
                className: "!bg-foreground !border !border-border !text-copy",
                success: {
                  className: "!bg-primary !text-primary-content !border-none",
                } as ToasterProps["toastOptions"],
                error: {
                  className: "!bg-red-500 !text-white !border-none",
                } as ToasterProps["toastOptions"],
              }}
            />
          </LanguageProvider>
        </CartProvider>
      </body>
    </html>
  );
}
