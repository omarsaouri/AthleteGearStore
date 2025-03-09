"use client";

import Link from "next/link";
import { ShoppingBag, Shield, Truck, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Hero Section - More compact on mobile */}
        <div className="text-center px-4 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-copy mb-4 sm:mb-6">
            {t("hero.title")}
          </h1>
          <p className="text-lg sm:text-xl text-copy-light max-w-2xl mx-auto mb-8 sm:mb-12">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Feature Cards - Better spacing on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
          {[
            { icon: Truck, key: "delivery" },
            { icon: Shield, key: "security" },
            { icon: Award, key: "quality" },
          ].map(({ icon: Icon, key }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-foreground p-4 sm:p-6 rounded-lg border border-border"
            >
              <div className="p-2 bg-primary/10 rounded-lg w-fit mb-3 sm:mb-4">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-copy mb-1 sm:mb-2">
                {t(`features.${key}.title`)}
              </h3>
              <p className="text-sm sm:text-base text-copy-light">
                {t(`features.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section - Adjusted padding and spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-foreground p-6 sm:p-8 rounded-lg border border-border text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-copy mb-3 sm:mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-sm sm:text-base text-copy-light mb-4 sm:mb-6">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/products"
            className="inline-flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors text-sm sm:text-base"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {t("cta.shopNow")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
