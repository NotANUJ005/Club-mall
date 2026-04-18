// API base URL: empty string in dev (Vite proxy handles it), full Render URL in production
const BASE_URL = import.meta.env.VITE_API_URL || "";

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
