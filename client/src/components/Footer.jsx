import { Link } from "react-router-dom";

const footerLinks = {
  Explore: [
    { label: "Group Deals", href: "#deals" },
    { label: "Store Directory", href: "#directory" },
    { label: "Events Calendar", href: "#events" },
    { label: "Membership", href: "#membership" }
  ],
  Account: [
    { label: "My Profile", to: "/profile" },
    { label: "Register", to: "/register" },
    { label: "Login", to: "/login" },
    { label: "Forgot Password", to: "/forgot-password" }
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" }
  ]
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer-full" aria-label="Site footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="brand" href="#top" aria-label="Club District home">
            <span className="brand-mark" aria-hidden="true">CD</span>
            <span>
              <strong>Club District</strong>
              <small>social shopping mall</small>
            </span>
          </a>
          <p className="footer-tagline">
            Shop together, save bigger, and turn every visit into an event.
            The premium social shopping experience designed for your crew.
          </p>
          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Instagram" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="X / Twitter" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z"/>
              </svg>
            </a>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {Object.entries(footerLinks).map(([group, links]) => (
            <div className="footer-nav-group" key={group}>
              <strong>{group}</strong>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© {year} Club District. All rights reserved.</p>
        <p className="footer-credit">Built with social-commerce in mind.</p>
      </div>
    </footer>
  );
}
