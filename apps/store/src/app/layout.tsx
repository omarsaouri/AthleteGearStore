import "./globals.css";
import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Inter, Montserrat } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Online Store",
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
