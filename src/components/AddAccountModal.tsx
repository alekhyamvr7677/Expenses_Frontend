
import { useEffect, useState } from "react";
import {
  X,
  Landmark,
  Wallet,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import type {
  Account,
  CreateAccountPayload,
} from "../types/account.types";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAccountPayload) => Promise<void>;
  editingAccount?: Account | null;
}

const AddAccountModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingAccount,
}: AddAccountModalProps) => {
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("SAVINGS");
  const [openingBalance, setOpeningBalance] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(editingAccount);

  useEffect(() => {
    if (!isOpen) return;

    if (editingAccount) {
      setBankName(editingAccount.bankName);
      setAccountType(editingAccount.accountType);
      setOpeningBalance(String(editingAccount.openingBalance));
      setCurrency(editingAccount.currency || "INR");
      setIsActive(editingAccount.isActive);
    } else {
      setBankName("");
      setAccountType("SAVINGS");
      setOpeningBalance("");
      setCurrency("INR");
      setIsActive(true);
    }

    setError("");
  }, [isOpen, editingAccount]);

  if (!isOpen) return null;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    const balance = Number(openingBalance);

    if (!bankName.trim()) {
      setError("Please enter an account name.");
      return;
    }

    if (openingBalance.trim() === "" || !Number.isFinite(balance) || balance < 0) {
      setError("Please enter a valid opening balance.");
      return;
    }

    const payload: CreateAccountPayload = {
      bankName: bankName.trim(),
      accountType,
      openingBalance: balance,
      currency,
      isActive,
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Account submission failed:", err);
      setError("Unable to save account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .am-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(15, 27, 48, 0.62);
          backdrop-filter: blur(5px);
          display: grid;
          place-items: center;
          padding: 18px;
          animation: am-fade .2s ease;
        }

        .am-modal {
          width: 100%;
          max-width: 490px;
          max-height: 92vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 21px;
          box-shadow: 0 25px 80px rgba(0,0,0,.2);
          animation: am-slide .25s ease;
        }

        @keyframes am-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes am-slide {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .am-header {
          padding: 25px 27px 20px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #edf0f5;
        }

        .am-title-area {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .am-header-icon {
          width: 45px;
          height: 45px;
          background: #e7f7ef;
          color: #159c78;
          display: grid;
          place-items: center;
          border-radius: 13px;
        }

        .am-header h2 {
          margin: 0 0 5px;
          color: #17243b;
          font-size: 19px;
          font-weight: 800;
        }

        .am-header p {
          margin: 0;
          color: #929caf;
          font-size: 11px;
        }

        .am-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 9px;
          background: #f2f5f8;
          color: #718096;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .am-close:hover {
          background: #e8edf2;
          color: #17243b;
        }

        .am-form {
          padding: 23px 27px 26px;
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .am-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .am-label {
          color: #42516a;
          font-size: 12px;
          font-weight: 700;
        }

        .am-input-wrap {
          position: relative;
        }

        .am-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ba5b4;
          pointer-events: none;
        }

        .am-input, .am-select {
          width: 100%;
          height: 46px;
          border: 1px solid #e3e9f0;
          background: #fbfcfe;
          border-radius: 10px;
          outline: none;
          padding: 0 13px;
          color: #26354c;
          font-size: 13px;
          transition: .2s;
        }

        .am-input.with-icon {
          padding-left: 41px;
        }

        .am-input:focus, .am-select:focus {
          border-color: #159c78;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(21,156,120,.1);
        }

        .am-type-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .am-type-option {
          border: 1px solid #e3e9f0;
          background: #fff;
          border-radius: 11px;
          padding: 13px 7px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #8490a3;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s;
        }

        .am-type-option:hover {
          border-color: #9ad9c2;
        }

        .am-type-option.selected {
          border-color: #159c78;
          background: #effaf5;
          color: #159c78;
        }

        .am-type-option svg {
          width: 21px;
          height: 21px;
        }

        .am-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 14px;
          border: 1px solid #e8edf2;
          border-radius: 11px;
          background: #fbfcfe;
        }

        .am-status-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .am-status-info strong {
          color: #35445b;
          font-size: 12px;
        }

        .am-status-info span {
          color: #9ba5b4;
          font-size: 10px;
        }

        .am-switch {
          width: 42px;
          height: 23px;
          border-radius: 20px;
          border: none;
          background: #cbd3df;
          padding: 3px;
          cursor: pointer;
          transition: .2s;
        }

        .am-switch.on {
          background: #159c78;
        }

        .am-switch-dot {
          display: block;
          width: 17px;
          height: 17px;
          background: white;
          border-radius: 50%;
          transition: .2s;
        }

        .am-switch.on .am-switch-dot {
          transform: translateX(19px);
        }

        .am-error {
          background: #fff1f0;
          border: 1px solid #ffd8d4;
          border-radius: 9px;
          color: #c74c43;
          padding: 11px;
          font-size: 12px;
        }

        .am-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 7px;
        }

        .am-cancel, .am-submit {
          min-height: 43px;
          padding: 0 19px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .am-cancel {
          background: #f1f4f8;
          color: #526078;
          border: none;
        }

        .am-submit {
          background: #159c78;
          color: #fff;
          border: none;
          box-shadow: 0 5px 12px rgba(21,156,120,.2);
        }

        .am-submit:hover:not(:disabled) {
          background: #108364;
        }

        .am-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @media(max-width: 480px) {
          .am-header, .am-form {
            padding-left: 19px;
            padding-right: 19px;
          }

          .am-type-grid {
            gap: 6px;
          }
        }
      `}</style>

      <div
        className="am-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !loading) {
            onClose();
          }
        }}
      >
        <div
          className="am-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-modal-title"
        >
          {/* Header */}
          <div className="am-header">
            <div className="am-title-area">
              <div className="am-header-icon">
                {isEditing ? (
                  <Landmark size={23} />
                ) : (
                  <Wallet size={23} />
                )}
              </div>

              <div>
                <h2 id="account-modal-title">
                  {isEditing ? "Edit Account" : "Add New Account"}
                </h2>
                <p>
                  {isEditing
                    ? "Update your account information."
                    : "Add another account to manage your money."}
                </p>
              </div>
            </div>

            <button
              className="am-close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>

          {/* Form */}
          <form className="am-form" onSubmit={handleSubmit}>
            <div className="am-field">
              <label className="am-label">Account Name</label>

              <div className="am-input-wrap">
                <Landmark
                  size={17}
                  className="am-input-icon"
                />

                <input
                  className="am-input with-icon"
                  type="text"
                  placeholder="Example: HDFC Bank"
                  value={bankName}
                  onChange={(event) => setBankName(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">Account Type</label>

              <div className="am-type-grid">
                <button
                  type="button"
                  className={`am-type-option ${
                    accountType === "SAVINGS" ? "selected" : ""
                  }`}
                  onClick={() => setAccountType("SAVINGS")}
                  disabled={loading}
                >
                  <Landmark />
                  Savings
                </button>

                <button
                  type="button"
                  className={`am-type-option ${
                    accountType === "CURRENT" ? "selected" : ""
                  }`}
                  onClick={() => setAccountType("CURRENT")}
                  disabled={loading}
                >
                  <Wallet />
                  Current
                </button>

                <button
                  type="button"
                  className={`am-type-option ${
                    accountType === "CREDIT_CARD" ? "selected" : ""
                  }`}
                  onClick={() => setAccountType("CREDIT_CARD")}
                  disabled={loading}
                >
                  <CreditCard />
                  Credit Card
                </button>
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">Opening Balance</label>

              <div className="am-input-wrap">
                <IndianRupee
                  size={17}
                  className="am-input-icon"
                />

                <input
                  className="am-input with-icon"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter opening balance"
                  value={openingBalance}
                  onChange={(event) =>
                    setOpeningBalance(event.target.value)
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="am-field">
              <label className="am-label">Currency</label>

              <select
                className="am-select"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
                disabled={loading}
              >
                <option value="INR">INR – Indian Rupee (₹)</option>
              </select>
            </div>

            <div className="am-status-row">
              <div className="am-status-info">
                <strong>Account Status</strong>
                <span>Keep this account active</span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                className={`am-switch ${isActive ? "on" : ""}`}
                onClick={() => setIsActive(!isActive)}
                disabled={loading}
              >
                <span className="am-switch-dot" />
              </button>
            </div>

            {error && (
              <div className="am-error">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="am-actions">
              <button
                type="button"
                className="am-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="am-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="am-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    {isEditing ? "Update Account" : "Create Account"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddAccountModal;
