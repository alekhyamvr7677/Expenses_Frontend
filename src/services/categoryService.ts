
import api from "./api";

import type {
  Category,
  CreateCategoryPayload,
} from "../types/category.types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");
  return response.data;
};

export const createCategory = async (
  payload: CreateCategoryPayload
): Promise<Category> => {
  const response = await api.post<Category>(
    "/createCategory",
    payload
  );

  return response.data;
};
