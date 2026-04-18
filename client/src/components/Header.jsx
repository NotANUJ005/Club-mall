import { Link } from "react-router-dom";

export default function Header({ menuOpen, onToggleMenu, wishlistCount, plannerCount, user, onLogout }) {
  function handleNavClick() {
    if (menuOpen) onToggleMenu();
  }

  return (
    <>
      <header className="site-header" role="banner">
        <a className="brand" href="#top" aria-label="Club District home">
          <span className="brand-mark" aria-hidden="true">CD</span>
          <span>
            <strong>Club District</strong>
            <small>social shopping mall</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#discover">Discover</a>
          <a href="#deals">Group Deals</a>
          <a href="#directory">Directory</a>
          <a href="#events">Events</a>
          <a href="#membership">Membership</a>
        </nav>

        <div className="header-actions">
          {wishlistCount > 0 && (
            <a className="ghost-button badge-button" href="#deals" aria-label={`${wishlistCount} items wishlisted`}>
              <span aria-hidden="true">🤍</span>
              <span className="badge-count">{wishlistCount}</span>
            </a>
          )}
          {plannerCount > 0 && (
            <a className="ghost-button badge-button" href="#deals" aria-label={`${plannerCount} items in planner`}>
              <span aria-hidden="true">📋</span>
              <span className="badge-count">{plannerCount}</span>
            </a>
          )}
          {wishlistCount === 0 && plannerCount === 0 && (
            <a className="ghost-button" href="#deals">
              Saves
            </a>
          )}
          {user ? (
            <>
              <div className="user-pill" aria-label={`Logged in as ${user.name}`}>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>
              <button className="secondary-button" type="button" onClick={onLogout} aria-label="Log out">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="secondary-button auth-link" to="/login">
                Login
              </Link>
              <Link className="primary-button auth-link" to="/register">
                Register
              </Link>
            </>
          )}
          <button
            className="menu-button"
            id="menuButton"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={onToggleMenu}
          >
            {menuOpen ? "✕" : "Menu"}
          </button>
        </div>
      </header>

      <nav className={`mobile-menu ${menuOpen ? "is-open" : ""}`} id="mobileMenu" aria-label="Mobile navigation">
        <a href="#discover" onClick={handleNavClick}>Discover</a>
        <a href="#deals" onClick={handleNavClick}>Group Deals</a>
        <a href="#directory" onClick={handleNavClick}>Directory</a>
        <a href="#events" onClick={handleNavClick}>Events</a>
        <a href="#membership" onClick={handleNavClick}>Membership</a>
        {user ? (
          <button className="secondary-button" type="button" onClick={onLogout}>
            Log out
          </button>
        ) : (
          <>
            <Link to="/login" onClick={handleNavClick}>Login</Link>
            <Link to="/register" onClick={handleNavClick}>Register</Link>
          </>
        )}
      </nav>
    </>
  );
}
