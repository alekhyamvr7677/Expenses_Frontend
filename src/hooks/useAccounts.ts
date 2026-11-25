
import { useCallback, useEffect, useState } from "react";

import type {
  Account,
  CreateAccountPayload,
} from "../types/account.types";

import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../services/accountService";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all accounts
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAccounts();

      setAccounts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Account loading error:", err);
      setError("Unable to load your accounts. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new account
  const addAccount = async (payload: CreateAccountPayload) => {
    await createAccount(payload);
    await fetchAccounts();
  };

  // Update existing account
  const editAccount = async (
    bankId: number,
    payload: CreateAccountPayload
  ) => {
    await updateAccount(bankId, payload);
    await fetchAccounts();
  };

  // Delete account
  const removeAccount = async (bankId: number) => {
    await deleteAccount(bankId);
    await fetchAccounts();
  };

  // Load accounts when hook is initialized
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    editAccount,
    removeAccount,
  };
};
