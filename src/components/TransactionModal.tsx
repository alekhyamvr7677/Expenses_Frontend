
import { useEffect, useState } from "react";
import { X, Plus, Loader2, CheckCircle2 } from "lucide-react";

import type { Account } from "../types/account.types";
import type {
  Category,
  TransactionType,
} from "../types/category.types";
import type {
  CreateTransactionPayload,
} from "../types/transaction.types";

import {
  getCategories,
  createCategory,
} from "../services/categoryService";

interface TransactionModalProps {
  isOpen: boolean;
  selectedAccount: Account | null;
  onClose: () => void;
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>;
}

const getCurrentDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 16);
};

function TransactionModal({
  isOpen,
  selectedAccount,
  onClose,
  onSubmit,
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] =
    useState(getCurrentDateTime());

  const [savingTransaction, setSavingTransaction] = useState(false);
  const [error, setError] = useState("");

  // Load categories whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        console.error("Category loading error:", err);
        setCategoryError("Unable to load categories. Please try again.");
      }
    };

    loadCategories();
  }, [isOpen]);

  // Show categories matching selected transaction type
  const filteredCategories = categories.filter(
    (category) => category.categoryType === type
  );

  // Reset category selection when transaction type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategoryId("");
    setShowCustomCategory(false);
    setCustomCategoryName("");
    setCategoryError("");
  };

  // Create a custom category
  const handleCreateCategory = async () => {
    const categoryName = customCategoryName.trim();

    if (!categoryName) {
      setCategoryError("Please enter a category name.");
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.categoryType === type &&
        category.categoryName.toLowerCase() ===
          categoryName.toLowerCase()
    );

    if (alreadyExists) {
      setCategoryError("This category already exists.");
      return;
    }

    try {
      setSavingCategory(true);
      setCategoryError("");

      const newCategory = await createCategory({
        categoryName,
        categoryType: type,
      });

      setCategories((previous) => [...previous, newCategory]);

      // Automatically select newly created category
      setCategoryId(String(newCategory.categoryId));

      setCustomCategoryName("");
      setShowCustomCategory(false);
    } catch (err) {
      console.error("Category creation error:", err);
      setCategoryError("Unable to save category. Please try again.");
    } finally {
      setSavingCategory(false);
    }
  };

  // Save transaction
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!selectedAccount) {
      setError("Please select an account.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setSavingTransaction(true);

      await onSubmit({
        amount: Number(amount),
        description: description.trim(),
        transactionType: type,
        transactionDate: transactionDate,
        categoryId: Number(categoryId),
        bankId: selectedAccount.bankId,
      });

      // Reset form after successful submission
      setAmount("");
      setDescription("");
      setCategoryId("");
      setType("EXPENSE");
      setTransactionDate(getCurrentDateTime());
      setShowCustomCategory(false);
      setCustomCategoryName("");
      setError("");
    } catch (err) {
      console.error("Transaction submission error:", err);
      setError("Unable to save transaction. Please try again.");
    } finally {
      setSavingTransaction(false);
    }
  };

  if (!isOpen || !selectedAccount) return null;

  return (
    <>
      <style>{`
        .transaction-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(12, 24, 43, .55);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .transaction-modal {
          width: 100%;
          max-width: 480px;
          max-height: 92vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 20px 65px #101c3030;
          font-family: 'DM Sans', sans-serif;
        }

        .transaction-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 23px;
        }

        .transaction-modal-header h2 {
          margin: 0 0 6px;
          color: #17243b;
          font-size: 21px;
          font-weight: 800;
        }

        .transaction-modal-header p {
          margin: 0;
          color: #8793a5;
          font-size: 12px;
        }

        .transaction-modal-close {
          border: none;
          background: #f1f4f8;
          color: #657187;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .transaction-account-info {
          background: #f2faf7;
          border: 1px solid #d9f1e7;
          border-radius: 12px;
          padding: 13px 15px;
          margin-bottom: 20px;
        }

        .transaction-account-info span {
          display: block;
          color: #7b958c;
          font-size: 10px;
          margin-bottom: 5px;
        }

        .transaction-account-info strong {
          color: #168767;
          font-size: 13px;
        }

        .transaction-type-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .transaction-type-tabs button {
          padding: 12px;
          border: 1px solid #e8edf2;
          border-radius: 11px;
          background: #fff;
          color: #7b8799;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .transaction-type-tabs button.active-income {
          background: #e5f7ef;
          border-color: #bcebd7;
          color: #159c78;
        }

        .transaction-type-tabs button.active-expense {
          background: #fff1e9;
          border-color: #ffddca;
          color: #d87d57;
        }

        .transaction-form-group {
          margin-bottom: 17px;
        }

        .transaction-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #526078;
          font-size: 11px;
          font-weight: 700;
        }

        .transaction-form-group input,
        .transaction-form-group select {
          width: 100%;
          height: 43px;
          border: 1px solid #e5eaf0;
          border-radius: 10px;
          padding: 0 12px;
          background: #fff;
          color: #25344b;
          font-size: 12px;
          outline: none;
        }

        .transaction-form-group input:focus,
        .transaction-form-group select:focus {
          border-color: #159c78;
          box-shadow: 0 0 0 3px #159c7815;
        }

        .custom-category-panel {
          margin-top: 11px;
          padding: 14px;
          background: #f5faf8;
          border: 1px solid #dcefe7;
          border-radius: 12px;
        }

        .custom-category-panel label {
          display: block;
          color: #526078;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .custom-category-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .custom-category-save {
          flex: 1;
          border: none;
          background: #159c78;
          color: #fff;
          border-radius: 8px;
          padding: 10px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .custom-category-cancel {
          border: 1px solid #e0e7e4;
          background: #fff;
          color: #647568;
          border-radius: 8px;
          padding: 10px 13px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .custom-category-save:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .custom-category-error,
        .transaction-form-error {
          color: #d9534f;
          font-size: 11px;
          margin-top: 8px;
        }

        .transaction-save-btn {
          width: 100%;
          border: none;
          border-radius: 11px;
          background: #159c78;
          color: #fff;
          padding: 14px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 5px;
        }

        .transaction-save-btn:hover {
          background: #108364;
        }

        .transaction-save-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="transaction-modal-overlay">
        <div className="transaction-modal">
          <div className="transaction-modal-header">
            <div>
              <h2>Add Transaction</h2>
              <p>Record income or expenses for your account</p>
            </div>

            <button
              type="button"
              className="transaction-modal-close"
              onClick={onClose}
              disabled={savingTransaction}
            >
              <X size={18} />
            </button>
          </div>

          <div className="transaction-account-info">
            <span>SELECTED ACCOUNT</span>
            <strong>{selectedAccount.bankName}</strong>
          </div>

          <div className="transaction-type-tabs">
            <button
              type="button"
              className={type === "INCOME" ? "active-income" : ""}
              onClick={() => handleTypeChange("INCOME")}
            >
              Income
            </button>

            <button
              type="button"
              className={type === "EXPENSE" ? "active-expense" : ""}
              onClick={() => handleTypeChange("EXPENSE")}
            >
              Expense
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="transaction-form-group">
              <label>Category</label>

              <select
                value={categoryId}
                onChange={(event) => {
                  const value = event.target.value;

                  if (value === "__CUSTOM__") {
                    setShowCustomCategory(true);
                    setCategoryId("");
                    setCustomCategoryName("");
                    setCategoryError("");
                  } else {
                    setShowCustomCategory(false);
                    setCategoryId(value);
                  }
                }}
                required={!showCustomCategory}
              >
                <option value="">Select category</option>

                {filteredCategories.map((category) => (
                  <option
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {category.categoryName}
                  </option>
                ))}

                <option value="__CUSTOM__">
                  + Add Custom Category
                </option>
              </select>

              {showCustomCategory && (
                <div className="custom-category-panel">
                  <label>New Category Name</label>

                  <input
                    type="text"
                    placeholder="Enter category name"
                    value={customCategoryName}
                    onChange={(event) =>
                      setCustomCategoryName(event.target.value)
                    }
                    maxLength={50}
                    autoFocus
                  />

                  <div className="custom-category-actions">
                    <button
                      type="button"
                      className="custom-category-save"
                      onClick={handleCreateCategory}
                      disabled={savingCategory}
                    >
                      {savingCategory ? (
                        <>
                          <Loader2
                            size={13}
                            className="transaction-spin"
                          /> Saving...
                        </>
                      ) : (
                        <>
                          <Plus size={13} /> Save Category
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="custom-category-cancel"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCustomCategoryName("");
                        setCategoryError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {categoryError && (
                    <div className="custom-category-error">
                      {categoryError}
                    </div>
                  )}
                </div>
              )}

              {!showCustomCategory && categoryError && (
                <div className="custom-category-error">
                  {categoryError}
                </div>
              )}
            </div>

            <div className="transaction-form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>

            <div className="transaction-form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="What was this transaction for?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="transaction-form-group">
              <label>Transaction Date</label>
              <input
                type="datetime-local"
                value={transactionDate}
                onChange={(event) =>
                  setTransactionDate(event.target.value)
                }
                required
              />
            </div>

            {error && (
              <div className="transaction-form-error">{error}</div>
            )}

            <button
              type="submit"
              className="transaction-save-btn"
              disabled={savingTransaction || savingCategory}
            >
              {savingTransaction ? "Saving Transaction..." : "Save Transaction"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default TransactionModal;
