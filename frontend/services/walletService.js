import { api } from "./api.js";

const WALLETS_BASE = "/wallets";

export async function getBalance() {
  const { ok, data } = await api.get(`${WALLETS_BASE}/balance/`);
  if (!ok) throw new Error(data.detail || data.error || "Failed to load balance");
  return data;
}

export async function deposit(amount, description = "Deposit") {
  const { ok, data } = await api.post(`${WALLETS_BASE}/deposit/`, {
    amount: String(amount),
    description,
  });
  if (!ok) throw new Error(data.amount?.[0] || data.error || "Deposit failed");
  return data;
}

export async function withdraw(amount, description = "Withdrawal") {
  const { ok, data } = await api.post(`${WALLETS_BASE}/withdraw/`, {
    amount: String(amount),
    description,
  });
  if (!ok) throw new Error(data.error || data.amount?.[0] || "Withdrawal failed");
  return data;
}

export async function getTransactions() {
  const { ok, data } = await api.get(`${WALLETS_BASE}/transactions/`);
  if (!ok) throw new Error(data.detail || "Failed to load transactions");
  return Array.isArray(data) ? data : [];
}
