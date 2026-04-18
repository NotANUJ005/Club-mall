import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { fetchJson } from "./api";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import DealPage from "./pages/DealPage";
import ToastProvider from "./components/ToastProvider";

const wishlistStorageKey = "clubDistrictWishlist";
const plannerStorageKey = "clubDistrictPlanner";
const tokenStorageKey = "clubDistrictToken";

function getInitialWishlist() {
  const saved = localStorage.getItem(wishlistStorageKey);
  return saved ? JSON.parse(saved) : [];
}

function getInitialPlanner() {
  const saved = localStorage.getItem(plannerStorageKey);
  return saved ? JSON.parse(saved) : [];
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem(tokenStorageKey) || "");
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState(() => getInitialWishlist());
  const [planner, setPlanner] = useState(() => getInitialPlanner());
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem(tokenStorageKey)));
  const initialMergeDone = useRef(false);

  // Initialize toast system
  useEffect(() => {
    // ToastProvider registers window.__cdToast imperatively on import
  }, []);

  useEffect(() => {
    localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(plannerStorageKey, JSON.stringify(planner));
  }, [planner]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    async function loadSession() {
      try {
        const response = await fetchJson("/api/auth/me", { token });
        setUser(response.user);
        setWishlist(response.user.wishlist || []);
        setPlanner(response.user.planner || []);
      } catch {
        clearSession();
      }
      setAuthLoading(false);
    }

    loadSession();
  }, [token]);

  useEffect(() => {
    if (!token || !user || initialMergeDone.current) {
      return;
    }

    initialMergeDone.current = true;
    const localWishlist = getInitialWishlist();
    const localPlanner = getInitialPlanner();
    const mergedWishlist = [...new Set([...(user.wishlist || []), ...localWishlist])];
    const mergedPlanner = [...new Set([...(user.planner || []), ...localPlanner])];

    if (
      mergedWishlist.length !== (user.wishlist || []).length ||
      mergedPlanner.length !== (user.planner || []).length
    ) {
      syncPreferences({ wishlist: mergedWishlist, planner: mergedPlanner });
      setWishlist(mergedWishlist);
      setPlanner(mergedPlanner);
    }
  }, [token, user]);

  function persistSession(nextToken, nextUser) {
    localStorage.setItem(tokenStorageKey, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setWishlist(nextUser.wishlist || []);
    setPlanner(nextUser.planner || []);
    initialMergeDone.current = false;
  }

  function clearSession() {
    localStorage.removeItem(tokenStorageKey);
    setToken("");
    setUser(null);
    setWishlist(getInitialWishlist());
    setPlanner(getInitialPlanner());
    initialMergeDone.current = false;
  }

  async function syncPreferences(nextPreferences) {
    if (!token) {
      return;
    }

    try {
      const response = await fetchJson("/api/users/preferences", {
        method: "PATCH",
        token,
        body: JSON.stringify(nextPreferences)
      });
      setUser(response.user);
      setWishlist(response.user.wishlist || []);
      setPlanner(response.user.planner || []);
    } catch {
      clearSession();
    }
  }

  if (authLoading) {
    return (
      <div className="auth-loading-screen" role="status" aria-live="polite">
        <div className="auth-loading-spinner" aria-hidden="true" />
        <span>Restoring your club session...</span>
      </div>
    );
  }

  return (
    <>
      <ToastProvider />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              token={token}
              wishlist={wishlist}
              planner={planner}
              setWishlist={setWishlist}
              setPlanner={setPlanner}
              onSyncPreferences={syncPreferences}
              onLogout={() => {
                clearSession();
                if (location.pathname !== "/") {
                  navigate("/");
                }
              }}
            />
          }
        />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage mode="login" onAuthSuccess={persistSession} />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <AuthPage mode="register" onAuthSuccess={persistSession} />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage user={user} onLogout={() => clearSession()} wishlist={wishlist} planner={planner} />} />
        <Route path="/admin" element={<AdminPage user={user} onLogout={() => clearSession()} />} />
        <Route path="/deals/:id" element={<DealPage user={user} onLogout={() => clearSession()} wishlist={wishlist} planner={planner} setWishlist={setWishlist} setPlanner={setPlanner} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
