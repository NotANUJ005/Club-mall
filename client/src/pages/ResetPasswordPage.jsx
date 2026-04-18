import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchJson } from "../api";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(location.search).get("token") || "", [location.search]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ text: "", type: "" });

    if (!token) {
      setMessage({ text: "Missing reset token. Please request a new reset link.", type: "is-error" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "is-error" });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetchJson("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });

      setMessage({ text: response.message, type: "is-success" });
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage({ text: error.message, type: "is-error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-shell single-column">
        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Set a new password</p>
          <h2>Reset password</h2>
          <label>
            New password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label>
            Confirm password
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Update password"}
          </button>
          <p className={`form-message ${message.type}`}>{message.text}</p>
          <p className="auth-footer-links">
            <Link to="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
