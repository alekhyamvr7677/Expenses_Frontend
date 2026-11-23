
import { useState } from "react";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Target,
  PieChart,
  Landmark,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Transactions", icon: Receipt },
  { name: "Budgets", icon: Target },
  { name: "Reports", icon: PieChart },
  { name: "Accounts", icon: Landmark },
];

const Navbar = ({ activePage, onNavigate }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .pw-navbar {
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #edf0f5;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .pw-navbar-inner {
          min-height: 76px;
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .pw-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font-family: 'Manrope', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #14213b;
          white-space: nowrap;
        }

        .pw-brand-icon {
          width: 41px;
          height: 41px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #14213b;
          color: #4de0b2;
        }

        .pw-brand-highlight {
          color: #159c78;
        }

        .pw-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pw-nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 13px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #758096;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pw-nav-item:hover {
          background: #f2f7f6;
          color: #159c78;
        }

        .pw-nav-item.active {
          background: #eaf8f3;
          color: #159c78;
        }

        .pw-nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .pw-icon-button {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: none;
          background: transparent;
          color: #718096;
          border-radius: 9px;
          cursor: pointer;
          position: relative;
        }

        .pw-icon-button:hover {
          background: #f1f5f9;
          color: #17243b;
        }

        .pw-notification-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f06b71;
          right: 7px;
          top: 6px;
          border: 1px solid white;
        }

        .pw-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-left: 14px;
          border-left: 1px solid #edf0f5;
          color: #64748b;
        }

        .pw-profile-avatar {
          width: 37px;
          height: 37px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #dff4eb;
          color: #138363;
          font-weight: 800;
        }

        .pw-profile-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 12px;
        }

        .pw-profile-info strong {
          color: #27354c;
        }

        .pw-profile-info span {
          color: #8a94a6;
          font-size: 11px;
        }

        .pw-mobile-menu {
          display: none;
          border: none;
          background: transparent;
          color: #17243b;
          cursor: pointer;
        }

        .pw-mobile-links {
          display: none;
        }

        @media (max-width: 1050px) {
          .pw-navbar-inner {
            flex-wrap: wrap;
            padding: 14px 4%;
            gap: 15px;
          }

          .pw-nav-links {
            order: 3;
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 700px) {
          .pw-navbar-inner {
            min-height: 68px;
            gap: 10px;
          }

          .pw-brand {
            font-size: 19px;
          }

          .pw-brand-icon {
            width: 37px;
            height: 37px;
          }

          .pw-nav-links {
            display: none;
          }

          .pw-nav-actions {
            gap: 5px;
          }

          .pw-profile-info,
          .pw-profile > svg {
            display: none;
          }

          .pw-profile {
            padding-left: 8px;
            border-left: none;
          }

          .pw-mobile-menu {
            display: grid;
            place-items: center;
            width: 37px;
            height: 37px;
          }

          .pw-mobile-links {
            display: flex;
            flex-direction: column;
            padding: 10px 4% 16px;
            gap: 5px;
            border-top: 1px solid #edf0f5;
          }

          .pw-mobile-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border: none;
            border-radius: 9px;
            background: transparent;
            color: #64748b;
            font-size: 13px;
            text-align: left;
            cursor: pointer;
          }

          .pw-mobile-item.active {
            background: #eaf8f3;
            color: #159c78;
          }
        }
      `}</style>

      <header className="pw-navbar">
        <div className="pw-navbar-inner">

          {/* Logo */}
          <div className="pw-brand">
            <div className="pw-brand-icon">
              <Wallet size={23} />
            </div>
            <span>
              AAFinora<span className="pw-brand-highlight"></span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="pw-nav-links">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`pw-nav-item ${
                    activePage === item.name ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(item.name)}
                >
                  <Icon size={17} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="pw-nav-actions">
            <button className="pw-icon-button" aria-label="Search">
              <Search size={19} />
            </button>

            <button
              className="pw-icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="pw-notification-dot" />
            </button>

            <div className="pw-profile">
              <div className="pw-profile-avatar">A</div>

              <div className="pw-profile-info">
                <strong>My Account</strong>
                <span>Personal</span>
              </div>

              <ChevronDown size={16} />
            </div>

            <button
              className="pw-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="pw-mobile-links">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`pw-mobile-item ${
                    activePage === item.name ? "active" : ""
                  }`}
                  onClick={() => handleNavigation(item.name)}
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
