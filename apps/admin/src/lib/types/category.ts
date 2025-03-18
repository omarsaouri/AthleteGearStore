export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priority?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description: string;
  priority?: number;
}
