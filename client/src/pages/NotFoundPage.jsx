import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found-layout" aria-label="Page not found">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <p className="eyebrow">Lost in the mall</p>
        <h1>This page doesn't exist.</h1>
        <p className="not-found-sub">
          Looks like this aisle is under construction. Head back to the homepage to
          find your deals, stores, and events.
        </p>
        <div className="not-found-actions">
          <Link className="primary-button" to="/">Back to Club District</Link>
          <a className="secondary-button" href="#deals">Browse deals</a>
        </div>
      </div>
    </div>
  );
}
