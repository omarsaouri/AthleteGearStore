import type { Product } from "../types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Map the snake_case database fields to camelCase for frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      salePrice: product.sale_price,
      onSale: product.on_sale,
      category: product.category,
      category_id: product.category_id,
      inventory: product.inventory,
      images: product.images,
      sizes: product.sizes,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Format product data consistently with getProducts
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      salePrice: data.sale_price,
      onSale: data.on_sale,
      category: data.category,
      category_id: data.category_id,
      inventory: data.inventory,
      images: data.images,
      sizes: data.sizes,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Format product data consistently with getProducts
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      salePrice: data.sale_price,
      onSale: data.on_sale,
      category: data.category,
      category_id: data.category_id,
      inventory: data.inventory,
      images: data.images,
      sizes: data.sizes,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
