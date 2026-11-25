
import { useState } from "react";
import {
  Wallet,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  RefreshCw,
  AlertCircle,
  Loader2,
  Receipt,
} from "lucide-react";

import AccountCard from "../components/AccountCard";
import AddAccountModal from "../components/AddAccountModal";

import { useAccounts } from "../hooks/useAccounts";

import type {
  Account,
  CreateAccountPayload,
} from "../types/account.types";

interface OverviewProps {
  onNavigate: (page: string) => void;
  onAddTransaction: (account: Account) => void;
}

const formatCurrency = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

function Overview({ onNavigate, onAddTransaction }: OverviewProps) {
  const {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    editAccount,
    removeAccount,
  } = useAccounts();

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [saving, setSaving] = useState(false);

  const totalBalance = accounts
    .filter((account) => account.isActive)
    .reduce(
      (total, account) => total + Number(account.openingBalance || 0),
      0
    );

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowAccountModal(true);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowAccountModal(true);
  };

  const handleSaveAccount = async (payload: CreateAccountPayload) => {
    try {
      setSaving(true);

      if (editingAccount) {
        await editAccount(editingAccount.bankId, payload);
      } else {
        await addAccount(payload);
      }

      setShowAccountModal(false);
      setEditingAccount(null);
    } catch (err) {
      console.error("Account save error:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (account: Account) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${account.bankName}?`
    );

    if (!confirmed) return;

    try {
      await removeAccount(account.bankId);
    } catch (err) {
      console.error("Account deletion error:", err);
      alert("Unable to delete account. Please try again.");
    }
  };

  const closeAccountModal = () => {
    if (saving) return;

    setShowAccountModal(false);
    setEditingAccount(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

        .overview-page {
          color: #17243b;
          font-family: 'DM Sans', sans-serif;
        }

        .dashboard-welcome {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          margin-bottom: 30px;
        }

        .welcome-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #159c78;
          font-size: 10px;
          letter-spacing: 1.5px;
          font-weight: 800;
          margin-bottom: 13px;
        }

        .welcome-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #28c69a;
          box-shadow: 0 0 0 4px #dff7ee;
        }

        .dashboard-welcome h1 {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(25px, 3vw, 35px);
          letter-spacing: -1.2px;
          margin: 0 0 9px;
          font-weight: 800;
        }

        .dashboard-welcome p {
          margin: 0;
          color: #7d899d;
          font-size: 13px;
          line-height: 1.8;
          max-width: 600px;
        }

        .dashboard-primary-btn,
        .add-transaction-btn {
          border: none;
          padding: 13px 17px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
          white-space: nowrap;
        }

        .dashboard-primary-btn {
          background: #159c78;
          color: #fff;
          box-shadow: 0 6px 15px #159c782b;
        }

        .dashboard-primary-btn:hover {
          background: #108364;
          transform: translateY(-2px);
        }

        .dashboard-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 38px;
        }

        .dashboard-summary-card {
          background: #fff;
          border: 1px solid #edf0f5;
          border-radius: 17px;
          padding: 23px;
          min-width: 0;
          box-shadow: 0 5px 20px #1b31520a;
        }

        .dashboard-summary-card.balance {
          background: #14213b;
          border-color: #14213b;
          color: #fff;
        }

        .summary-card-heading {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .summary-card-icon {
          width: 41px;
          height: 41px;
          border-radius: 12px;
          display: grid;
          place-items: center;
        }

        .summary-card-icon svg {
          width: 20px;
        }

        .balance-icon {
          color: #4de0b2;
          background: #263d58;
        }

        .income-icon {
          color: #159c78;
          background: #e5f7ef;
        }

        .expense-icon {
          color: #dd8955;
          background: #fff1e8;
        }

        .summary-card-label {
          color: #8c97a9;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .balance .summary-card-label {
          color: #aab6c9;
        }

        .summary-card-value {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(23px, 2.5vw, 30px);
          letter-spacing: -1px;
          margin: 22px 0 14px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .summary-card-footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 7px;
          color: #9ba6b6;
          font-size: 10px;
        }

        .balance .summary-card-footer {
          color: #4de0b2;
        }

        .summary-muted {
          color: #a0aaba;
        }

        .dashboard-section {
          margin-bottom: 25px;
        }

        .dashboard-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 19px;
        }

        .dashboard-section-heading h2 {
          font-family: 'Manrope', sans-serif;
          font-size: 19px;
          margin: 0 0 5px;
          color: #1a2941;
          font-weight: 800;
        }

        .dashboard-section-heading p {
          color: #929caf;
          font-size: 12px;
          margin: 0;
        }

        .dashboard-text-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #159c78;
          background: transparent;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .dashboard-accounts-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
        }

        .overview-account-wrapper {
          display: flex;
          flex-direction: column;
          gap: 11px;
          min-width: 0;
        }

        .add-transaction-btn {
          width: 100%;
          background: #e5f7ef;
          color: #159c78;
          border: 1px solid #ccefe0;
        }

        .add-transaction-btn:hover:not(:disabled) {
          background: #159c78;
          color: #fff;
          transform: translateY(-2px);
        }

        .add-transaction-btn:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .dashboard-message {
          min-height: 190px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #fff;
          border: 1px solid #edf0f5;
          border-radius: 16px;
          color: #8793a5;
          text-align: center;
          padding: 30px;
        }

        .dashboard-message h3 {
          margin: 0;
          font-size: 15px;
          color: #29374d;
        }

        .dashboard-message p {
          margin: 0;
          font-size: 12px;
          line-height: 1.7;
        }

        .dashboard-retry {
          border: none;
          border-radius: 9px;
          background: #eaf8f3;
          color: #159c78;
          padding: 10px 15px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .dashboard-loading-icon {
          animation: dashboard-spin 1s linear infinite;
        }

        @keyframes dashboard-spin {
          to { transform: rotate(360deg); }
        }

        @media(max-width: 1050px) {
          .dashboard-accounts-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media(max-width: 700px) {
          .dashboard-welcome {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-summary-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .dashboard-accounts-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-section-heading h2 {
            font-size: 17px;
          }
        }
      `}</style>

      <div className="overview-page">
        {/* Welcome */}
        <section className="dashboard-welcome">
          <div>
            <div className="welcome-eyebrow">
              <span className="welcome-dot" />
              YOUR PERSONAL FINANCE SPACE
            </div>

            <h1>Welcome back! 👋</h1>

            <p>
              Take control of your finances. Manage your accounts,
              track every transaction, and make smarter financial
              decisions every day.
            </p>
          </div>

          <button
            className="dashboard-primary-btn"
            onClick={handleAddAccount}
          >
            <Plus size={19} />
            Add Account
          </button>
        </section>

        {/* Summary cards */}
        <section className="dashboard-summary-grid">
          <div className="dashboard-summary-card balance">
            <div className="summary-card-heading">
              <div className="summary-card-icon balance-icon">
                <Wallet />
              </div>

              <span className="summary-card-label">
                TOTAL OPENING BALANCE
              </span>
            </div>

            <h2 className="summary-card-value">
              {formatCurrency(totalBalance)}
            </h2>

            <div className="summary-card-footer">
              <span>Across active accounts</span>
              <span className="summary-muted">
                {accounts.filter((account) => account.isActive).length} active accounts
              </span>
            </div>
          </div>

          <div className="dashboard-summary-card">
            <div className="summary-card-heading">
              <div className="summary-card-icon income-icon">
                <ArrowDownRight />
              </div>

              <span className="summary-card-label">TOTAL INCOME</span>
            </div>

            <h2 className="summary-card-value">₹0.00</h2>

            <div className="summary-card-footer">
              <span>Income received</span>
              <span className="summary-muted">This month</span>
            </div>
          </div>

          <div className="dashboard-summary-card">
            <div className="summary-card-heading">
              <div className="summary-card-icon expense-icon">
                <ArrowUpRight />
              </div>

              <span className="summary-card-label">TOTAL EXPENSES</span>
            </div>

            <h2 className="summary-card-value">₹0.00</h2>

            <div className="summary-card-footer">
              <span>Money spent</span>
              <span className="summary-muted">This month</span>
            </div>
          </div>
        </section>

        {/* My Accounts */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <h2>My Accounts</h2>
              <p>
                All your accounts in one place. Manage your money easily.
              </p>
            </div>

            <button
              className="dashboard-text-btn"
              onClick={() => onNavigate("Accounts")}
            >
              View all
              <ArrowUpRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="dashboard-message">
              <Loader2 className="dashboard-loading-icon" size={28} />
              <p>Loading your accounts...</p>
            </div>
          ) : error ? (
            <div className="dashboard-message">
              <AlertCircle size={29} color="#d9534f" />
              <h3>Unable to load accounts</h3>
              <p>{error}</p>

              <button
                className="dashboard-retry"
                onClick={fetchAccounts}
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          ) : accounts.length === 0 ? (
            <div className="dashboard-message">
              <Landmark size={38} color="#159c78" />
              <h3>No accounts available</h3>
              <p>
                Your added bank accounts will appear here.
                Use the Add Account button above to create an account.
              </p>
            </div>
          ) : (
            <div className="dashboard-accounts-grid">
              {accounts.map((account) => (
                <div
                  className="overview-account-wrapper"
                  key={account.bankId}
                >
                  <AccountCard
                    account={account}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                  />

                  <button
                    className="add-transaction-btn"
                    disabled={!account.isActive}
                    onClick={() => onAddTransaction(account)}
                  >
                    <Plus size={17} />
                    Add Transaction
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Add / Edit Account Modal */}
      <AddAccountModal
        isOpen={showAccountModal}
        onClose={closeAccountModal}
        onSubmit={handleSaveAccount}
        editingAccount={editingAccount}
      />
    </>
  );
}

export default Overview;
