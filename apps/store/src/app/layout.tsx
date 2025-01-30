import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Inter, Montserrat } from "next/font/google";
import { CartProvider } from "@/lib/context/CartContext";
import Navigation from "@/components/Navigation";
import { Toaster, ToasterProps } from "sonner";

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
    <html lang="fr" className={`${inter.className} ${montserrat.variable}`}>
      <body>
        <CartProvider>
          <LanguageProvider>
            <Navigation />
            {children}
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
