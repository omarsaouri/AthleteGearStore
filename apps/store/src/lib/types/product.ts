export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  onSale: boolean;
  category: string;
  category_id?: string;
  inventory: number;
  images: string[];
  sizes?: string[];
  created_at?: string;
  updated_at?: string;
}
