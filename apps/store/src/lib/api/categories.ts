import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
