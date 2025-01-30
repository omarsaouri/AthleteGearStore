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
    products: {
      title: "Nos Produits",
      searchPlaceholder: "Rechercher des produits...",
      addToCart: "Ajouter au panier",
      addedToCart: "Ajouté au panier avec succès!",
      backToProducts: "Retour aux produits",
      notFound: "Produit non trouvé",
    },
    cart: {
      title: "Panier",
      empty: "Votre panier est vide",
      emptyMessage:
        "Commencez vos achats pour ajouter des articles à votre panier",
      continueShopping: "Continuer vos achats",
      total: "Total",
      checkout: "Passer à la caisse",
    },
    checkout: {
      title: "Commander",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Numéro de téléphone",
      address: "Adresse de livraison",
      total: "Total",
      placeOrder: "Passer la commande",
      processing: "En cours...",
      success: "Commande passée avec succès !",
      error: "Échec de la commande",
      successTitle: "Commande Confirmée !",
      successMessage:
        "Merci pour votre achat. Nous vous enverrons un email avec les détails de votre commande.",
      continueShopping: "Continuer vos achats",
      phoneContact:
        "Nous vous contacterons sur votre numéro de téléphone pour confirmer votre commande. Si nous ne parvenons pas à vous joindre après deux tentatives, votre commande sera annulée.",
      emailConfirmation:
        "Vous recevrez bientôt un email de confirmation de commande.",
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
    products: {
      title: "Our Products",
      searchPlaceholder: "Search products...",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart successfully!",
      backToProducts: "Back to Products",
      notFound: "Product not found",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyMessage: "Start shopping to add items to your cart",
      continueShopping: "Continue Shopping",
      total: "Total",
      checkout: "Proceed to Checkout",
    },
    checkout: {
      title: "Checkout",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      address: "Shipping Address",
      total: "Total",
      placeOrder: "Place Order",
      processing: "Processing...",
      success: "Order placed successfully!",
      error: "Failed to place order",
      successTitle: "Order Confirmed!",
      successMessage:
        "Thank you for your purchase. We'll send you an email with your order details.",
      continueShopping: "Continue Shopping",
      phoneContact:
        "We will contact you on your phone number to confirm your order. If we cannot reach you after two attempts, your order will be cancelled.",
      emailConfirmation:
        "You will receive an order confirmation email shortly.",
    },
  },
};

export type Language = keyof typeof translations;
