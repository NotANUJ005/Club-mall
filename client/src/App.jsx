import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { fetchJson } from "./api";
import ScrollToTop from "./components/ScrollToTop";
import ToastProvider from "./components/ToastProvider";
import PageSkeleton from "./components/PageSkeleton";

// Lazy-load all page components for code splitting
const HomePage         = lazy(() => import("./pages/HomePage"));
const AuthPage         = lazy(() => import("./pages/AuthPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage  = lazy(() => import("./pages/ResetPasswordPage"));
const ProfilePage      = lazy(() => import("./pages/ProfilePage"));
const AdminPage        = lazy(() => import("./pages/AdminPage"));
const DealPage         = lazy(() => import("./pages/DealPage"));
const StorePage        = lazy(() => import("./pages/StorePage"));
const NotFoundPage     = lazy(() => import("./pages/NotFoundPage"));

const wishlistStorageKey = "clubDistrictWishlist";
const plannerStorageKey  = "clubDistrictPlanner";
const tokenStorageKey    = "clubDistrictToken";
const themeStorageKey    = "clubDistrictTheme";

function getInitialWishlist() {
  try { return JSON.parse(localStorage.getItem(wishlistStorageKey)) || []; } catch { return []; }
}
function getInitialPlanner() {
  try { return JSON.parse(localStorage.getItem(plannerStorageKey)) || []; } catch { return []; }
}

function SuspenseFallback() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 16px" }}>
      <PageSkeleton />
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token,       setToken]       = useState(() => localStorage.getItem(tokenStorageKey) || "");
  const [user,        setUser]        = useState(null);
  const [wishlist,    setWishlist]    = useState(getInitialWishlist);
  const [planner,     setPlanner]     = useState(getInitialPlanner);
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(tokenStorageKey)));
  const [theme,       setTheme]       = useState(() => localStorage.getItem(themeStorageKey) || "light");
  const initialMergeDone = useRef(false);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  // Persist collections
  useEffect(() => { localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(plannerStorageKey,  JSON.stringify(planner));  }, [planner]);

  // Restore session
  useEffect(() => {
    if (!token) { setUser(null); setAuthLoading(false); return; }
    (async () => {
      try {
        const { user: u } = await fetchJson("/api/auth/me", { token });
        setUser(u);
        setWishlist(u.wishlist || []);
        setPlanner(u.planner  || []);
      } catch { clearSession(); }
      setAuthLoading(false);
    })();
  }, [token]);

  // Merge local + server collections on first login
  useEffect(() => {
    if (!token || !user || initialMergeDone.current) return;
    initialMergeDone.current = true;
    const merged = {
      wishlist: [...new Set([...(user.wishlist || []), ...getInitialWishlist()])],
      planner:  [...new Set([...(user.planner  || []), ...getInitialPlanner()])]
    };
    const changed =
      merged.wishlist.length !== (user.wishlist || []).length ||
      merged.planner.length  !== (user.planner  || []).length;
    if (changed) { syncPreferences(merged); setWishlist(merged.wishlist); setPlanner(merged.planner); }
  }, [token, user]);

  function persistSession(nextToken, nextUser) {
    localStorage.setItem(tokenStorageKey, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setWishlist(nextUser.wishlist || []);
    setPlanner(nextUser.planner  || []);
    initialMergeDone.current = false;
  }

  function clearSession() {
    localStorage.removeItem(tokenStorageKey);
    setToken(""); setUser(null);
    setWishlist(getInitialWishlist());
    setPlanner(getInitialPlanner());
    initialMergeDone.current = false;
  }

  async function syncPreferences(next) {
    if (!token) return;
    try {
      const { user: u } = await fetchJson("/api/users/preferences", {
        method: "PATCH", token, body: JSON.stringify(next)
      });
      setUser(u); setWishlist(u.wishlist || []); setPlanner(u.planner || []);
    } catch { clearSession(); }
  }

  const headerProps = {
    theme,
    onToggleTheme: () => setTheme(t => t === "light" ? "dark" : "light")
  };

  if (authLoading) {
    return (
      <div className="auth-loading-screen" role="status" aria-live="polite">
        <div className="auth-loading-spinner" aria-hidden="true" />
        <span>Restoring your club session…</span>
      </div>
    );
  }

  return (
    <>
      <ToastProvider />
      <ScrollToTop />

      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user} token={token}
                wishlist={wishlist} planner={planner}
                setWishlist={setWishlist} setPlanner={setPlanner}
                onSyncPreferences={syncPreferences}
                headerProps={headerProps}
                onLogout={() => { clearSession(); if (location.pathname !== "/") navigate("/"); }}
              />
            }
          />
          <Route path="/login"    element={user ? <Navigate to="/" replace /> : <AuthPage mode="login"    onAuthSuccess={persistSession} />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <AuthPage mode="register" onAuthSuccess={persistSession} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />
          <Route path="/profile"
            element={
              <ProfilePage
                user={user} setUser={setUser} token={token}
                onLogout={clearSession}
                wishlist={wishlist} planner={planner}
                {...headerProps}
              />
            }
          />
          <Route path="/admin"
            element={<AdminPage user={user} token={token} onLogout={clearSession} {...headerProps} />}
          />
          <Route path="/deals/:id"
            element={
              <DealPage
                user={user} token={token} onLogout={clearSession}
                wishlist={wishlist} planner={planner}
                setWishlist={setWishlist} setPlanner={setPlanner}
                {...headerProps}
              />
            }
          />
          <Route path="/stores/:id"
            element={<StorePage user={user} onLogout={clearSession} wishlist={wishlist} planner={planner} {...headerProps} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
