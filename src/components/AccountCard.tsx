
import {
  Landmark,
  Wallet,
  CreditCard,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { useState } from "react";
import type { Account } from "../types/account.types";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  totalIncome?: number;
  totalExpense?: number;
}

const AccountCard = ({
  account,
  onEdit,
  onDelete,
  totalIncome = 0,
  totalExpense = 0,
}: AccountCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  };

  const getAccountIcon = () => {
    switch (account.accountType.toUpperCase()) {
      case "SAVINGS":
        return <Landmark size={23} />;
      case "CURRENT":
        return <Wallet size={23} />;
      case "CREDIT":
      case "CREDIT_CARD":
        return <CreditCard size={23} />;
      default:
        return <Wallet size={23} />;
    }
  };

  const getAccountStyle = () => {
    switch (account.accountType.toUpperCase()) {
      case "SAVINGS":
        return "account-savings";
      case "CURRENT":
        return "account-current";
      case "CREDIT":
      case "CREDIT_CARD":
        return "account-credit";
      default:
        return "account-default";
    }
  };
const currentBalance =
  Number(account.openingBalance || 0) +
  Number(totalIncome || 0) -
  Number(totalExpense || 0);
  return (
    <>
      <style>{`
        .ac-card {
          background: #ffffff;
          border: 1px solid #edf0f5;
          border-radius: 17px;
          padding: 21px;
          position: relative;
          transition: all 0.25s ease;
          min-width: 0;
        }

        .ac-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(27, 49, 82, 0.09);
          border-color: #d9eae3;
        }

        .ac-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 21px;
        }

        .ac-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          display: grid;
          place-items: center;
        }

        .account-savings {
          background: #eaf0ff;
          color: #5278d9;
        }

        .account-current {
          background: #e4f8ef;
          color: #17966e;
        }

        .account-credit {
          background: #fff0e9;
          color: #dd8955;
        }

        .account-default {
          background: #f0edff;
          color: #7963c7;
        }

        .ac-menu-button {
          width: 34px;
          height: 34px;
          border: none;
          background: transparent;
          color: #8994a6;
          border-radius: 9px;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .ac-menu-button:hover {
          background: #f1f5f9;
          color: #26354c;
        }

        .ac-menu {
          position: absolute;
          top: 58px;
          right: 17px;
          width: 145px;
          padding: 6px;
          border: 1px solid #edf0f5;
          border-radius: 11px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(0,0,0,0.10);
          z-index: 5;
        }

        .ac-menu-item {
          width: 100%;
          border: none;
          background: transparent;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 9px;
          border-radius: 7px;
          font-size: 12px;
          color: #46546b;
          cursor: pointer;
        }

        .ac-menu-item:hover {
          background: #f4f7fa;
        }

        .ac-menu-item.delete {
          color: #d9534f;
        }

        .ac-type {
          color: #98a2b2;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .ac-name {
          color: #26354c;
          font-size: 15px;
          font-weight: 700;
          margin: 7px 0 15px;
        }

        .ac-balance {
          font-size: 26px;
          font-weight: 800;
          color: #17243b;
          letter-spacing: -0.8px;
          overflow-wrap: anywhere;
        }

        .ac-balance-label {
          color: #9ba5b4;
          font-size: 10px;
          margin-top: 4px;
        }

        .ac-transaction-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 19px;
        }

        .ac-summary-box {
          min-width: 0;
          padding: 12px 10px;
          border-radius: 12px;
        }

        .ac-summary-box.income {
          background: #effaf5;
          border: 1px solid #ddf3e8;
        }

        .ac-summary-box.expense {
          background: #fff5f1;
          border: 1px solid #fce6dc;
        }

        .ac-summary-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .ac-summary-box.income .ac-summary-label,
        .ac-summary-box.income .ac-summary-value {
          color: #159c78;
        }

        .ac-summary-box.expense .ac-summary-label,
        .ac-summary-box.expense .ac-summary-value {
          color: #d66f55;
        }

        .ac-summary-value {
          font-size: 14px;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .ac-footer {
          border-top: 1px solid #f0f2f6;
          margin-top: 17px;
          padding-top: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #9ba5b4;
          font-size: 11px;
        }

        .ac-footer svg {
          color: #159c78;
        }

        .ac-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #159c78;
          font-size: 10px;
          font-weight: 700;
        }

        .ac-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #159c78;
        }

        @media (max-width: 500px) {
          .ac-card {
            padding: 17px;
          }

          .ac-balance {
            font-size: 23px;
          }

          .ac-summary-value {
            font-size: 12px;
          }
        }
      `}</style>

      <div className="ac-card">
        <div className="ac-card-top">
          <div className={`ac-icon ${getAccountStyle()}`}>
            {getAccountIcon()}
          </div>

          <button
            className="ac-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Account actions"
          >
            <MoreHorizontal size={21} />
          </button>
        </div>

        <span className="ac-type">
          {account.accountType.replaceAll("_", " ")}
        </span>

        <h3 className="ac-name">{account.bankName}</h3>

<div className="ac-balance">
  {formatCurrency(currentBalance, account.currency)}
</div>

<div className="ac-balance-label">Current Balance</div>

        {/* Income and Expense Summary */}
        <div className="ac-transaction-summary">
          <div className="ac-summary-box income">
            <div className="ac-summary-label">
              <TrendingUp size={14} />
              Income
            </div>

            <div className="ac-summary-value">
              {formatCurrency(totalIncome, account.currency)}
            </div>
          </div>

          <div className="ac-summary-box expense">
            <div className="ac-summary-label">
              <TrendingDown size={14} />
              Expense
            </div>

            <div className="ac-summary-value">
              {formatCurrency(totalExpense, account.currency)}
            </div>
          </div>
        </div>

        <div className="ac-footer">
          <span className="ac-status">
            <span className="ac-status-dot" />
            {account.isActive ? "Active" : "Inactive"}
          </span>

          <span>Account Summary</span>
          <ArrowUpRight size={17} />
        </div>

        {menuOpen && (
          <div className="ac-menu">
            <button
              className="ac-menu-item"
              onClick={() => {
                setMenuOpen(false);
                onEdit(account);
              }}
            >
              <Pencil size={15} />
              Edit Account
            </button>

            <button
              className="ac-menu-item delete"
              onClick={() => {
                setMenuOpen(false);
                onDelete(account);
              }}
            >
              <Trash2 size={15} />
              Delete Account
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountCard;
