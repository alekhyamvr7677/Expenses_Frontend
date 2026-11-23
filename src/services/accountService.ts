
import api from "./api";
import type {
  Account,
  CreateAccountPayload,
} from "../types/account.types";

// Get all accounts
export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await api.get<Account[]>("/accounts");
    return response.data;
  } catch (error: any) {
    console.error("GET Accounts Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Get account by ID
export const getAccountById = async (
  bankId: number
): Promise<Account> => {
  const response = await api.get<Account>(`/accounts/${bankId}`);
  return response.data;
};

// Create account
export const createAccount = async (
  payload: CreateAccountPayload
): Promise<Account> => {
  try {
    console.log("Creating account with payload:", payload);

    const response = await api.post<Account>(
      "/createAccount",
      payload
    );

    console.log("Account creation response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("CREATE ACCOUNT API ERROR:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });

    throw error;
  }
};

// Update account
export const updateAccount = async (
  bankId: number,
  payload: CreateAccountPayload
): Promise<Account> => {
  const response = await api.put<Account>(
    `/accounts/update/${bankId}`,
    payload
  );

  return response.data;
};

// Delete account
export const deleteAccount = async (
  bankId: number
): Promise<void> => {
  await api.delete(`/accounts/delete/${bankId}`);
};
