import type { Category, CreateCategoryData } from "../types/category";

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

export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await fetch(`/api/categories/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
}

export async function createCategory(
  data: CreateCategoryData,
): Promise<Category> {
  try {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryData>,
): Promise<Category> {
  try {
    const response = await fetch(`/api/categories`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
}
