/**
 * Shared API config and helpers for the backend.
 * Backend should be running at this URL (e.g. Django on port 8000).
 * Uses credentials: 'include' so session cookie is sent for dashboard APIs.
 */
export const API_BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '') + "/api";


function getCsrfToken() {
  return localStorage.getItem("csrfToken") || "";
}
/**
 * Utility to handle fetch API errors more transparently.
 * This improves error reporting, especially for network issues or non-JSON responses.
 */
export async function safeApiRequest(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const csrf = getCsrfToken();
  if (csrf) headers["X-CSRFToken"] = csrf;

  try {
    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    let data;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    // Here we return a network error explicitly
    return {
      ok: false,
      status: 0,
      data: {},
      error: "Network error: " + (error.message || error.toString()),
    };
  }
}

// Optionally, use this safeApiRequest in your login form and catch error.message to show to user

export async function apiRequest(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const csrf = getCsrfToken();
  if (csrf) headers["X-CSRFToken"] = csrf;
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiRequest(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options) =>
    apiRequest(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: (path, body, options) =>
    apiRequest(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (path, options) =>
    apiRequest(path, { ...options, method: "DELETE" }),
};
