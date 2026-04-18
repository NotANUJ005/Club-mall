import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ text: "", type: "", resetLink: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setResult({ text: "", type: "", resetLink: "" });

    try {
      const response = await fetchJson("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      setResult({
        text: response.message,
        type: "is-success",
        resetLink: response.resetLink || ""
      });
    } catch (error) {
      setResult({ text: error.message, type: "is-error", resetLink: "" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-shell single-column">
        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Reset access</p>
          <h2>Forgot password</h2>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Preparing..." : "Send reset link"}
          </button>
          <p className={`form-message ${result.type}`}>{result.text}</p>
          {result.resetLink ? (
            <p className="dev-reset-link">
              Development reset link: <Link to={result.resetLink}>{result.resetLink}</Link>
            </p>
          ) : null}
          <p className="auth-footer-links">
            <Link to="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
