
import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { getTransactions } from "../services/transactionService";
import type { Transaction } from "../types/transaction.types";

interface TransactionListProps {
  refreshKey?: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Date unavailable";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function TransactionList({ refreshKey = 0 }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTransactions();

      setTransactions(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Transaction loading error:", err);
      setError("Unable to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  return (
    <>
      <style>{`
        .transaction-section {
          margin-top: 38px;
        }

        .transaction-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .transaction-heading h2 {
          margin: 0 0 5px;
          font-size: 19px;
          font-weight: 800;
          color: #1a2941;
          font-family: 'Manrope', sans-serif;
        }

        .transaction-heading p {
          margin: 0;
          color: #929caf;
          font-size: 12px;
        }

        .transaction-refresh {
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #e5eaf0;
          background: #fff;
          color: #526078;
          border-radius: 9px;
          padding: 9px 12px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .transaction-refresh:hover {
          color: #159c78;
          border-color: #159c78;
        }

        .transaction-list {
          background: #fff;
          border: 1px solid #edf0f5;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 5px 20px #1b31520a;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 17px 20px;
          border-bottom: 1px solid #f0f2f6;
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-left {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .transaction-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 13px;
        }

        .transaction-icon.income {
          background: #e5f7ef;
          color: #159c78;
        }

        .transaction-icon.expense {
          background: #fff1e9;
          color: #d87d57;
        }

        .transaction-info {
          min-width: 0;
        }

        .transaction-info h3 {
          margin: 0 0 5px;
          color: #25344b;
          font-size: 13px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .transaction-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          color: #929caf;
          font-size: 10px;
        }

        .transaction-meta span:not(:last-child)::after {
          content: "•";
          margin-left: 7px;
          color: #c4cbd5;
        }

        .transaction-right {
          flex-shrink: 0;
          text-align: right;
        }

        .transaction-amount {
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
        }

        .transaction-amount.income {
          color: #159c78;
        }

        .transaction-amount.expense {
          color: #d66f55;
        }

        .transaction-type-label {
          display: inline-block;
          margin-top: 5px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .7px;
          color: #929caf;
        }

        .transaction-state {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 25px;
          color: #929caf;
          text-align: center;
          font-size: 12px;
        }

        .transaction-state strong {
          color: #29374d;
          font-size: 14px;
        }

        .transaction-state button {
          border: none;
          background: #eaf8f3;
          color: #159c78;
          padding: 9px 14px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .transaction-spin {
          animation: transaction-spin 1s linear infinite;
        }

        @keyframes transaction-spin {
          to { transform: rotate(360deg); }
        }

        @media(max-width: 500px) {
          .transaction-item {
            padding: 14px 12px;
          }

          .transaction-icon {
            width: 36px;
            height: 36px;
          }

          .transaction-amount {
            font-size: 12px;
          }
        }
      `}</style>

      <section className="transaction-section">
        <div className="transaction-heading">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your saved income and expense records</p>
          </div>

          <button
            className="transaction-refresh"
            onClick={fetchTransactions}
            disabled={loading}
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        <div className="transaction-list">
          {loading ? (
            <div className="transaction-state">
              <Loader2 size={26} className="transaction-spin" />
              Loading transactions...
            </div>
          ) : error ? (
            <div className="transaction-state">
              <Receipt size={28} />
              <strong>Unable to load transactions</strong>
              {error}
              <button onClick={fetchTransactions}>Try Again</button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="transaction-state">
              <Receipt size={30} />
              <strong>No transactions yet</strong>
              Your saved income and expenses will appear here.
            </div>
          ) : (
            transactions.map((transaction) => {
              const isIncome =
                transaction.transactionType === "INCOME";

              return (
                <div
                  className="transaction-item"
                  key={transaction.transactionId}
                >
                  <div className="transaction-left">
                    <div
                      className={`transaction-icon ${
                        isIncome ? "income" : "expense"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={20} />
                      ) : (
                        <ArrowUpRight size={20} />
                      )}
                    </div>

                    <div className="transaction-info">
                      <h3>
                        {transaction.description || "No description"}
                      </h3>

                      <div className="transaction-meta">
                        <span>
                          {transaction.category?.categoryName || "Uncategorized"}
                        </span>
                        <span>
                          {transaction.account?.bankName || "Unknown account"}
                        </span>
                        <span>
                          {formatDate(
                            transaction.transactionDate ||
                              transaction.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="transaction-right">
                    <div
                      className={`transaction-amount ${
                        isIncome ? "income" : "expense"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>

                    <span className="transaction-type-label">
                      {transaction.transactionType}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}

export default TransactionList;
