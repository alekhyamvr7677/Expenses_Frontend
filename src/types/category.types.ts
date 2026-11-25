export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryType: TransactionType;
}

export interface CreateCategoryPayload {
  categoryName: string;
  categoryType: TransactionType;
}