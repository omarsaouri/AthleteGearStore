"use client";

import Link from "next/link";
import { ShoppingBag, Shield, Truck, Award, Globe2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Logo } from "@/components/Logo";

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo and Language Selector */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Logo className="w-10 h-10" />
        </div>
        <button
          onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
          className="flex items-center px-3 py-2 bg-foreground text-copy border border-border rounded-md hover:bg-border transition-colors"
        >
          <Globe2 className="w-4 h-4 mr-2" />
          {language.toUpperCase()}
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-copy mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-copy-light max-w-2xl mx-auto mb-12">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-foreground p-6 rounded-lg border border-border">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-copy mb-2">
              {t("features.delivery.title")}
            </h3>
            <p className="text-copy-light">
              {t("features.delivery.description")}
            </p>
          </div>

          <div className="bg-foreground p-6 rounded-lg border border-border">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-copy mb-2">
              {t("features.security.title")}
            </h3>
            <p className="text-copy-light">
              {t("features.security.description")}
            </p>
          </div>

          <div className="bg-foreground p-6 rounded-lg border border-border">
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-copy mb-2">
              {t("features.quality.title")}
            </h3>
            <p className="text-copy-light">
              {t("features.quality.description")}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-foreground p-8 rounded-lg border border-border text-center">
          <h2 className="text-2xl font-bold text-copy mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-copy-light mb-6">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex justify-center items-center px-6 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t("cta.shopNow")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
