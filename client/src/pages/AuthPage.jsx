import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchJson } from "../api";

const initialState = { name: "", email: "", password: "", confirmPassword: "" };

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "",        color: "" },
    { label: "Weak",    color: "#a43a22" },
    { label: "Fair",    color: "#b07d11" },
    { label: "Good",    color: "#226742" },
    { label: "Strong",  color: "#1a5c36" },
    { label: "Strong",  color: "#1a5c36" },
  ];
  return { score, ...levels[score] };
}

function PasswordInput({ value, onChange, placeholder, id, showToggle = true }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: showToggle ? "3rem" : undefined }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            position: "absolute", right: "12px", top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", cursor: "pointer", color: "var(--muted)",
            fontSize: "0.9rem", padding: "4px"
          }}
        >
          {visible ? "🙈" : "👁"}
        </button>
      )}
    </div>
  );
}

function PasswordStrengthBar({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  const pct = (score / 5) * 100;
  return (
    <div style={{ marginTop: "-4px" }}>
      <div style={{ height: "4px", background: "var(--line)", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: color,
          borderRadius: "999px", transition: "width 300ms ease"
        }} />
      </div>
      {label && (
        <span style={{ fontSize: "0.75rem", color, marginTop: "4px", display: "block" }}>
          {label} password
        </span>
      )}
    </div>
  );
}

export default function AuthPage({ mode, onAuthSuccess }) {
  const isRegister = mode === "register";
  const navigate   = useNavigate();
  const location   = useLocation();
  const [form,      setForm]      = useState(initialState);
  const [message,   setMessage]   = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);

  function field(key) {
    return (e) => setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Client-side validation
    if (!form.email || !form.password || (isRegister && !form.name)) {
      setMessage({ text: "Please fill in all required fields.", type: "is-error" }); return;
    }
    if (isRegister && form.password.length < 8) {
      setMessage({ text: "Password must be at least 8 characters.", type: "is-error" }); return;
    }
    if (isRegister && form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "is-error" }); return;
    }

    setSubmitting(true);
    try {
      const payload  = isRegister
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await fetchJson(endpoint, { method: "POST", body: JSON.stringify(payload) });
      onAuthSuccess(response.token, response.user);
      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      setMessage({ text: error.message, type: "is-error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      <div className={`auth-shell ${!isRegister ? "single-column" : ""}`}>
        {isRegister && (
          <div className="auth-copy">
            <p className="eyebrow">Create account</p>
            <h1>Join the club mall experience.</h1>
            <p>Save brands, carry your planner across sessions, and access member-ready experiences across the site.</p>
            <Link className="secondary-button auth-link" to="/">← Back to home</Link>
          </div>
        )}

        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2>{isRegister ? "Register" : "Welcome back"}</h2>

          {isRegister && (
            <label>
              Full name
              <input type="text" value={form.name} onChange={field("name")} placeholder="Your name" autoComplete="name" required />
            </label>
          )}

          <label>
            Email
            <input type="email" value={form.email} onChange={field("email")} placeholder="name@example.com" autoComplete="email" required />
          </label>

          <label>
            Password
            <PasswordInput
              id="password"
              value={form.password}
              onChange={field("password")}
              placeholder={isRegister ? "At least 8 characters" : "Your password"}
            />
            {isRegister && <PasswordStrengthBar password={form.password} />}
          </label>

          {isRegister && (
            <label>
              Confirm password
              <PasswordInput
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={field("confirmPassword")}
                placeholder="Repeat password"
              />
            </label>
          )}

          <button className="primary-button" type="submit" disabled={submitting} id="auth-submit-btn">
            {submitting
              ? (isRegister ? "Creating account…" : "Signing in…")
              : (isRegister ? "Create account" : "Login")}
          </button>

          {message.text && (
            <p className={`form-message ${message.type}`} role="alert">{message.text}</p>
          )}

          <div className="auth-footer-links">
            {isRegister ? (
              <p>Already have an account? <Link to="/login">Login</Link></p>
            ) : (
              <>
                <p>New here? <Link to="/register">Create an account</Link></p>
                <p><Link to="/forgot-password">Forgot password?</Link></p>
                <p style={{ marginTop: "8px" }}><Link to="/" style={{ color: "var(--muted)", fontSize: "0.85rem" }}>← Back to home</Link></p>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
