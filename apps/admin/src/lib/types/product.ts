export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  category: string;
  category_id?: string;
  inventory: number;
  images: string[];
  sizes: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: string;
  salePrice?: string;
  onSale: boolean;
  category: string;
  category_id: string;
  inventory: string;
  images: string[];
  sizes: string[];
}
