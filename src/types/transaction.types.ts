import type { TransactionType } from "./category.types";

export interface CreateTransactionPayload {
  amount: number;
  description: string;
  transactionType: TransactionType;
  transactionDate: string;
  categoryId: number;
  bankId: number;
}

export interface Transaction {
  transactionId: number;
  amount: number;
  description: string;
  transactionType: TransactionType;
  transactionDate?: string;

  category: {
    categoryId: number;
    categoryName: string;
    categoryType: TransactionType;
  };

  account: {
    bankId: number;
    bankName: string;
  };

  createdAt?: string;
  updatedAt?: string;
}