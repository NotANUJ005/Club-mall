import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchJson } from "../api";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export default function AuthPage({ mode, onAuthSuccess }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ text: "", type: "" });

    if (!form.email || !form.password || (isRegister && !form.name)) {
      setMessage({ text: "Please fill in all required fields.", type: "is-error" });
      return;
    }

    if (isRegister && form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "is-error" });
      return;
    }

    setSubmitting(true);

    try {
      const payload = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };

      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await fetchJson(endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      onAuthSuccess(response.token, response.user);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination);
    } catch (error) {
      setMessage({ text: error.message, type: "is-error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-shell">
        <div className="auth-copy">
          <p className="eyebrow">{isRegister ? "Create account" : "Welcome back"}</p>
          <h1>{isRegister ? "Join the club mall experience." : "Sign in to keep your mall day synced."}</h1>
          <p>
            Use your account to save brands, carry your planner across sessions, and access member-ready experiences
            across the site.
          </p>
          <Link className="secondary-button auth-link" to="/">
            Back to home
          </Link>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>{isRegister ? "Register" : "Login"}</h2>
          {isRegister ? (
            <label>
              Full name
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Your name"
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="name@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="At least 8 characters"
            />
          </label>
          {isRegister ? (
            <label>
              Confirm password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                placeholder="Repeat password"
              />
            </label>
          ) : null}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Working..." : isRegister ? "Create account" : "Login"}
          </button>
          <p className={`form-message ${message.type}`}>{message.text}</p>
          <div className="auth-footer-links">
            {isRegister ? (
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            ) : (
              <>
                <p>
                  New here? <Link to="/register">Create an account</Link>
                </p>
                <p>
                  Forgot your password? <Link to="/forgot-password">Reset it</Link>
                </p>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
