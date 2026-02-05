import { api } from "./api.js";

const USERS_BASE = "/users";

/**
 * Login with email and password. Returns { user, message } on success.
 */
export async function login(email, password) {
  const { ok, data } = await api.post(`${USERS_BASE}/login/`, {
    email,
    password,
  });
  if (!ok) {
    const msg =
      data.non_field_errors?.[0] ||
      data.email?.[0] ||
      data.password?.[0] ||
      data.detail ||
      "Login failed. Please try again.";
    return { success: false, error: msg };
  }
  if (data.csrfToken) localStorage.setItem("csrfToken", data.csrfToken);
  return { success: true, user: data.user, message: data.message };
}

/**
 * Register a new user. Expects { username, email, phone, password, password2 }.
 */
export async function register({ username, email, phone, password, password2 }) {
  const { ok, data } = await api.post(`${USERS_BASE}/register/`, {
    username,
    email,
    phone,
    password,
    password2,
  });
  if (!ok) {
    const msg =
      data.non_field_errors?.[0] ||
      data.username?.[0] ||
      data.email?.[0] ||
      data.phone?.[0] ||
      data.password?.[0] ||
      data.detail ||
      "Registration failed. Please try again.";
    return { success: false, error: msg };
  }
  return { success: true, message: data.message };
}

/**
 * Get stored user from localStorage (set after login).
 */
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

/**
 * Store user in localStorage (call after successful login).
 */
export function setStoredUser(user) {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

export function logout() {
  setStoredUser(null);
  localStorage.removeItem("csrfToken");
}
