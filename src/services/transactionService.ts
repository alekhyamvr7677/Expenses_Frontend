import api from "./api";

import type {
  Transaction,
  CreateTransactionPayload,
} from "../types/transaction.types";

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>("/transactions");
  return response.data;
};

export const createTransaction = async (
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  const response = await api.post<Transaction>(
    "/transactions/create",
    payload
  );

  return response.data;
};

export const updateTransaction = async (
  transactionId: number,
  payload: CreateTransactionPayload
): Promise<Transaction> => {
  const response = await api.put<Transaction>(
    `/transactions/update/${transactionId}`,
    payload
  );

  return response.data;
};

export const deleteTransaction = async (
  transactionId: number
): Promise<void> => {
  await api.delete(`/transactions/delete/${transactionId}`);
};