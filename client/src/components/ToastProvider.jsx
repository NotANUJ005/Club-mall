import { useEffect, useRef } from "react";

/**
 * Toast notification system.
 * Usage: call window.__cdToast("Message", "success" | "error" | "info")
 */
let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    toastContainer.setAttribute("aria-atomic", "false");
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = "info", durationMs = 3200) {
  const container = ensureContainer();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "status");

  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${message}</span>`;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add("toast-visible");
  });

  // Animate out and remove
  const timer = setTimeout(() => {
    toast.classList.remove("toast-visible");
    toast.classList.add("toast-leaving");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, durationMs);

  // Allow clicking to dismiss early
  toast.addEventListener("click", () => {
    clearTimeout(timer);
    toast.classList.remove("toast-visible");
    toast.classList.add("toast-leaving");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  });
}

// Expose globally so any component can trigger it easily
if (typeof window !== "undefined") {
  window.__cdToast = showToast;
}

export default function ToastProvider() {
  return null; // Purely imperative — no render needed
}
