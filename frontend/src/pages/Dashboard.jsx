import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCog,
  FaEnvelope,
  FaBell,
  FaUser,
  FaSyncAlt,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import { getStoredUser, logout } from "../../services/authService.js";
import {
  getBalance,
  deposit,
  withdraw,
  getTransactions,
} from "../../services/walletService.js";
import "../styles/dashboard.css";

const NAV_LINKS = [
  { id: "account", label: "My account" },
  { id: "transactions", label: "Transactions" },
  { id: "cards", label: "Cards" },
  { id: "offers", label: "Offers" },
  { id: "investments", label: "Investments" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeNav, setActiveNav] = useState("account");

  const [depositAmount, setDepositAmount] = useState("");
  const [depositDesc, setDepositDesc] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDesc, setWithdrawDesc] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const transactionsRef = useRef(null);
  const actionsRef = useRef(null);
  const profileWrapRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    try {
      const [bal, txs] = await Promise.all([
        getBalance(),
        getTransactions(),
      ]);
      setBalance(bal);
      setTransactions(txs);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to load data. Please log in again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileOpen]);

  async function handleDeposit(e) {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Enter a valid amount." });
      return;
    }
    setDepositLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await deposit(amount, depositDesc || "Deposit");
      await loadData();
      setDepositAmount("");
      setDepositDesc("");
      setMessage({ type: "success", text: data.message || "Deposit successful." });
      setShowDepositModal(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setDepositLoading(false);
    }
  }

  async function handleWithdraw(e) {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Enter a valid amount." });
      return;
    }
    setWithdrawLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await withdraw(amount, withdrawDesc || "Withdrawal");
      await loadData();
      setWithdrawAmount("");
      setWithdrawDesc("");
      setMessage({ type: "success", text: data.message || "Withdrawal successful." });
      setShowWithdrawModal(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setWithdrawLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function scrollTo(ref) {
    setProfileOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) return "Today";
      return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });
    } catch {
      return iso;
    }
  }

  function formatMoney(amount) {
    const n = typeof amount === "string" ? parseFloat(amount) : amount;
    return Number.isFinite(n)
      ? parseFloat(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : amount;
  }

  if (!user) return null;

  const displayName = user.username || user.email || "User";
  const initial = (displayName[0] || "U").toUpperCase();
  const currency = balance?.currency || "GHS";
  const availableBalance = balance != null ? formatMoney(balance.balance) : "0.00";

  const withdrawalsTotal = transactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const depositsTotal = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="dashboard-page">
      {/* Top Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <span className="navbar-logo-icon">W</span>
            <span className="navbar-logo-text">Wallet</span>
          </div>
          <div className="navbar-links">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`navbar-link ${activeNav === link.id ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(link.id);
                  if (link.id === "transactions") scrollTo(transactionsRef);
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
        <div className="navbar-right">
          <button type="button" className="navbar-icon-btn" title="Settings">
            <FaCog className="navbar-icon" />
          </button>
          <button type="button" className="navbar-icon-btn" title="Messages">
            <FaEnvelope className="navbar-icon" />
          </button>
          <button type="button" className="navbar-icon-btn" title="Notifications">
            <FaBell className="navbar-icon" />
          </button>
          <span className="navbar-username">{displayName}</span>
          <div className="navbar-profile-wrap" ref={profileWrapRef}>
            <button
              type="button"
              className="navbar-avatar"
              onClick={() => setProfileOpen((o) => !o)}
              title="Profile"
            >
              {initial}
            </button>
            {profileOpen && (
              <div className="navbar-profile-dropdown">
                <div className="navbar-dropdown-item">Profile</div>
                <Link
                  to="/login"
                  className="navbar-dropdown-item navbar-dropdown-logout"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
          <button type="button" className="navbar-icon-btn" title="Refresh" onClick={loadData}>
            <FaSyncAlt className="navbar-icon" />
          </button>
        </div>
      </nav>

      {/* Main content - white rounded area */}
      <main className="dashboard-main">
        <div className="dashboard-content-wrap">
          {message.text && (
            <div className={`dashboard-message ${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="dashboard-loading">Loading…</div>
          ) : (
            <>
              {/* Row 1: Main account + Standing orders */}
              <div className="dashboard-grid dashboard-grid-top">
                <div className="main-account-card">
                  <div className="main-account-header">
                    <span className="main-account-label">Main account</span>
                  </div>
                  <div className="main-account-name">Wallet Savings Account</div>
                  <div className="main-account-number">
                    <span>•••• •••• •••• {balance?.id ?? "0000"}</span>
                    <FaChevronRight className="main-account-arrow" />
                  </div>
                  <div className="main-account-funds">
                    <span className="main-account-funds-label">Available funds</span>
                    <span className="main-account-funds-amount">
                      {availableBalance} {currency}
                    </span>
                  </div>
                  <div className="main-account-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => setShowDepositModal(true)}
                    >
                      Transfer money
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowWithdrawModal(true)}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                <div className="standing-orders-card">
                  <div className="standing-orders-pattern" />
                  <h3 className="standing-orders-title">Define standing orders</h3>
                  <p className="standing-orders-desc">
                    Set up recurring transfers so you never miss a payment. Define once and we’ll
                    handle your regular transfers.
                  </p>
                  <button type="button" className="standing-orders-btn">
                    Define standing order
                  </button>
                  <div className="standing-orders-icon">
                    <FaSyncAlt />
                  </div>
                </div>
              </div>

              {/* Row 2: Other accounts / single wallet card */}
              <div className="dashboard-section-title">My wallet</div>
              <div className="dashboard-cards-row">
                <div className="wallet-mini-card">
                  <div className="wallet-mini-header">
                    <span className="wallet-mini-logo">W</span>
                    <button type="button" className="wallet-mini-menu">⋯</button>
                  </div>
                  <div className="wallet-mini-number">•••• •••• •••• 9448</div>
                  <div className="wallet-mini-balance">
                    {availableBalance} {currency}
                  </div>
                </div>
              </div>

              {/* Row 3: Latest transactions + All expenses */}
              <div className="dashboard-grid dashboard-grid-bottom" ref={actionsRef}>
                <section className="latest-transactions-card" ref={transactionsRef}>
                  <div className="section-header">
                    <h3>Latest transactions</h3>
                    <FaChevronRight className="section-arrow" />
                  </div>
                  {transactions.length === 0 ? (
                    <p className="transactions-empty">No transactions yet.</p>
                  ) : (
                    <ul className="tx-list">
                      {transactions.slice(0, 6).map((tx) => (
                        <li key={tx.id || `${tx.created_at}-${tx.amount}`} className="tx-row">
                          <span className="tx-date">{formatDate(tx.created_at)}</span>
                          <span className="tx-desc">{tx.description || tx.type}</span>
                          <span className="tx-type">{tx.type}</span>
                          <span className={`tx-amount ${tx.type === "deposit" ? "positive" : "negative"}`}>
                            {tx.type === "deposit" ? "+" : "-"} {formatMoney(tx.amount)} {currency}
                          </span>
                          <FaChevronDown className="tx-expand" />
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" className="see-more">See more</button>
                </section>

                <section className="all-expenses-card">
                  <div className="section-header">
                    <h3>All expenses</h3>
                    <FaChevronRight className="section-arrow" />
                  </div>
                  <div className="expenses-summary">
                    <div className="expenses-row">
                      <span>Withdrawals (total)</span>
                      <span className="expenses-value negative">{formatMoney(withdrawalsTotal)} {currency}</span>
                    </div>
                    <div className="expenses-row">
                      <span>Deposits (total)</span>
                      <span className="expenses-value positive">{formatMoney(depositsTotal)} {currency}</span>
                    </div>
                  </div>
                  <div className="expenses-chart-wrap">
                    <div
                      className="expenses-donut"
                      style={{
                        "--deposit-pct":
                          depositsTotal + withdrawalsTotal > 0
                            ? (depositsTotal / (depositsTotal + withdrawalsTotal)) * 100
                            : 50,
                      }}
                    >
                      <div className="donut-hole" />
                      <span className="donut-center-label">{currency}</span>
                    </div>
                    <div className="expenses-legend">
                      <div className="legend-item">
                        <span className="legend-dot deposit" /> Deposits
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot withdrawal" /> Withdrawals
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Deposit modal */}
      {showDepositModal && (
        <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Transfer money / Deposit</h3>
            <form onSubmit={handleDeposit}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={depositDesc}
                onChange={(e) => setDepositDesc(e.target.value)}
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowDepositModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={depositLoading}>
                  {depositLoading ? "Processing…" : "Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw modal */}
      {showWithdrawModal && (
        <div className="modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Withdraw</h3>
            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={withdrawDesc}
                onChange={(e) => setWithdrawDesc(e.target.value)}
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={withdrawLoading}>
                  {withdrawLoading ? "Processing…" : "Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
