import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you would send this to Sentry / LogRocket etc.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="not-found-layout" role="alert">
          <div className="not-found-card">
            <span className="not-found-code" aria-hidden="true">!</span>
            <h1>Something went wrong</h1>
            <p className="not-found-sub">
              An unexpected error occurred in the application. Our team has been notified.
            </p>
            <div className="not-found-actions">
              <button
                className="primary-button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
              >
                Go home
              </button>
              <button
                className="secondary-button"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <details style={{ marginTop: "2rem", textAlign: "left" }}>
                <summary style={{ cursor: "pointer", color: "var(--muted)", fontSize: "0.85rem" }}>
                  Error details (dev only)
                </summary>
                <pre style={{ fontSize: "0.75rem", color: "var(--muted)", whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
