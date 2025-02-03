"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CheckoutSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-copy mb-4">
          {t("checkout.successTitle")}
        </h1>
        <div className="space-y-4 mb-8 text-copy">
          <p>{t("checkout.successMessage")}</p>
          <p className="text-copy-light">{t("checkout.phoneContact")}</p>
        </div>
        <Link
          href="/products"
          className="inline-flex justify-center px-6 py-3 bg-primary text-primary-content rounded-md hover:bg-primary-light transition-colors"
        >
          {t("checkout.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
