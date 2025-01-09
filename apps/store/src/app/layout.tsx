import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
