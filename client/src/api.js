// In local development we use the Vite proxy.
// In production, prefer an explicit Vercel env var and fall back to the current Render API URL.
const BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "https://club-mall.onrender.com")).replace(
  /\/$/,
  ""
);

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
