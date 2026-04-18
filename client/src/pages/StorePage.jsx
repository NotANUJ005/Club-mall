import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";
import { usePageTitle } from "../hooks/usePageTitle";

const TYPE_ICONS = {
  Fashion: "👗", Beauty: "💄", Tech: "🎧", Dining: "🍽️",
  Cafe: "☕", Wellness: "🧘", Lifestyle: "🛋️", Family: "👨‍👩‍👧"
};

export default function StorePage({ user, onLogout, wishlist, planner, theme, onToggleTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  usePageTitle(store ? store.title : "Store");

  useEffect(() => {
    async function loadStore() {
      try {
        const response = await fetchJson(`/api/stores/${id}`);
        setStore(response.data);
      } catch (err) {
        setError("Could not load store details.");
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, [id]);

  if (loading) return <div className="page-shell"><PageSkeleton /></div>;

  if (error || !store) {
    return (
      <div className="page-shell">
        <Header user={user} onLogout={onLogout} wishlistCount={wishlist?.length || 0} plannerCount={planner?.length || 0} />
        <main id="main-content" style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1>Store Not Found</h1>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="primary-button" style={{ marginTop: "2rem" }}>Go Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  const icon = TYPE_ICONS[store.type] || "🏪";
  const now = new Date();
  const hour = now.getHours();
  // Simple open/closed heuristic
  const isOpenNow = store.hours && store.hours.includes("AM") ? hour >= 9 && hour < 22 : hour >= 11 && hour < 23;

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={wishlist?.length || 0} plannerCount={planner?.length || 0} />
      <main id="main-content">
        <section className="section" style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 0" }}>
          <button onClick={() => navigate(-1)} className="secondary-button" style={{ marginBottom: "2rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Back
          </button>

          <div className="store-detail-hero">
            <div className="store-detail-icon">{icon}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontFamily: "\"Syne\", sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>{store.title}</h1>
                <span className={`store-status ${isOpenNow ? "store-open" : "store-closed"}`}>
                  {isOpenNow ? "● Open Now" : "● Closed"}
                </span>
              </div>
              <p className="eyebrow" style={{ marginTop: "0.5rem" }}>{store.type} · Floor {store.floor}</p>
            </div>
          </div>

          <div className="store-detail-grid">
            <div className="store-detail-card">
              <h2>About</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{store.description}</p>
            </div>
            <div className="store-detail-info">
              <div className="store-info-item">
                <span>🕐 Hours</span>
                <strong>{store.hours}</strong>
              </div>
              <div className="store-info-item">
                <span>📍 Location</span>
                <strong>Floor {store.floor}, Club District Mall</strong>
              </div>
              <div className="store-info-item">
                <span>🏷️ Category</span>
                <strong>{store.type}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
