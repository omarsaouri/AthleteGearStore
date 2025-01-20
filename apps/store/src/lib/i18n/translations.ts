export const translations = {
  fr: {
    hero: {
      title: "Athlete's Gear Store",
      subtitle:
        "Votre source premium de physiothérapie. Découvrez des solutions efficaces pour la récupération et la santé optimale.",
    },
    features: {
      delivery: {
        title: "Livraison Express",
        description: "Livraison gratuite partout au Maroc",
      },
      security: {
        title: "Équipement Professionnel",
        description: "Matériel de physiothérapie certifié et approuvé",
      },
      quality: {
        title: "Expertise & Conseil",
        description:
          "Assistance professionnelle pour choisir le bon équipement",
      },
    },
    cta: {
      title: "Prêt à optimiser votre récupération ?",
      subtitle:
        "Explorez notre gamme d'équipements spécialisés pour la physiothérapie.",
      shopNow: "Découvrir",
      createAccount: "Créer un compte",
    },
  },
  en: {
    hero: {
      title: "Athlete's Gear Store",
      subtitle:
        "Your premium source for physiotherapy. Discover effective solutions for recovery and optimal health.",
    },
    features: {
      delivery: {
        title: "Express Delivery",
        description: "Free shipping across Morocco",
      },
      security: {
        title: "Professional Equipment",
        description: "Certified and approved physiotherapy material",
      },
      quality: {
        title: "Expertise & Guidance",
        description: "Professional assistance in choosing the right equipment",
      },
    },
    cta: {
      title: "Ready to optimize your recovery?",
      subtitle: "Explore our range of specialized physiotherapy equipment.",
      shopNow: "Discover",
      createAccount: "Create Account",
    },
  },
};

export type Language = keyof typeof translations;
