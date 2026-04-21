// API configuration: use environment variable if present, otherwise fall back to production Render URL.
// In local development (Vite), it will use the proxy if VITE_API_URL is empty and we are in DEV mode.
const BASE_URL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? "" : "https://club-mall.onrender.com")
).replace(/\/$/, "");

if (import.meta.env.DEV) {
  console.log("🚀 API Base URL:", BASE_URL || "Local Proxy");
}

export async function fetchJson(url, options = {}) {
  const token = options.token;
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
