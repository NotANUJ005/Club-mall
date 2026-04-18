import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";

export default function DealPage({ user, onLogout, wishlist, planner, setWishlist, setPlanner }) {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDeal() {
      try {
        const response = await fetchJson(`/api/deals/${id}`);
        setDeal(response.data);
      } catch (err) {
        setError("Could not load deal details.");
      } finally {
        setLoading(false);
      }
    }
    loadDeal();
  }, [id]);

  if (loading) return <div className="page-shell"><PageSkeleton /></div>;

  if (error || !deal) {
    return (
      <div className="page-shell">
        <Header user={user} onLogout={onLogout} wishlistCount={wishlist.length} plannerCount={planner.length} />
        <main id="main-content" style={{textAlign: "center", padding: "4rem 1rem"}}>
          <h1>Deal Not Found</h1>
          <p>{error || "This deal might have expired or been removed."}</p>
          <Link to="/" className="primary-button" style={{marginTop: "2rem", display: "inline-block"}}>Back to Deals</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isPlanner = planner.includes(deal._id);
  const isWishlist = wishlist.includes(deal._id);

  function togglePlanner() {
    if (!user) return alert("Log in to plan your deals.");
    setPlanner(curr => curr.includes(deal._id) ? curr.filter(d => d !== deal._id) : [...curr, deal._id]);
  }

  function toggleWishlist() {
    if (!user) return alert("Log in to save to your wishlist.");
    setWishlist(curr => curr.includes(deal._id) ? curr.filter(d => d !== deal._id) : [...curr, deal._id]);
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={wishlist.length} plannerCount={planner.length} />
      <main id="main-content">
        <section className="section" style={{maxWidth: "900px", margin: "0 auto", padding: "4rem 1rem"}}>
          <Link to="/" style={{color: "var(--foreground)", textDecoration: "none", marginBottom: "2rem", display: "inline-block"}}>← Back</Link>
          
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", "@media(max-width: 768px)": {gridTemplateColumns: "1fr"}}}>
            <div style={{aspectRatio: "4/3", background: "var(--surface)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem"}}>
              {deal.badge === "Hot" ? "🔥" : deal.badge === "New" ? "✨" : "🛍️"}
            </div>
            
            <div>
              <span className="eyebrow" style={{display: "inline-block", background: "var(--primary-subtle)", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "999px", marginBottom: "1rem"}}>
                {deal.category}
              </span>
              <h1 style={{marginBottom: "1rem", fontSize: "2.5rem"}}>{deal.title}</h1>
              <p style={{fontSize: "1.25rem", color: "var(--muted)", marginBottom: "2rem"}}>{deal.description}</p>
              
              <div style={{display: "flex", gap: "2rem", marginBottom: "2rem"}}>
                <div>
                  <span style={{display: "block", fontSize: "0.875rem", color: "var(--muted)"}}>Price</span>
                  <strong style={{fontSize: "2rem"}}>${deal.price}</strong>
                </div>
                <div>
                  <span style={{display: "block", fontSize: "0.875rem", color: "var(--muted)"}}>You Save</span>
                  <strong style={{fontSize: "2rem", color: "var(--success)"}}>${deal.savings}</strong>
                </div>
              </div>

              <div style={{background: "var(--surface)", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem"}}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "1rem"}}>
                  <span><strong>{deal.members}</strong> members joined</span>
                  <span style={{color: "var(--warning)"}}>Ends {deal.eta}</span>
                </div>
                <div style={{height: "8px", background: "var(--border)", borderRadius: "999px", overflow: "hidden"}}>
                  <div style={{height: "100%", width: "75%", background: "var(--primary)"}}></div>
                </div>
              </div>

              <div style={{display: "flex", gap: "1rem"}}>
                <button 
                  className={isPlanner ? "secondary-button" : "primary-button"} 
                  style={{flex: 1, padding: "1rem"}}
                  onClick={togglePlanner}
                >
                  {isPlanner ? "✓ Added to Planner" : "Join Deal"}
                </button>
                <button 
                  className={isWishlist ? "primary-button" : "ghost-button"} 
                  style={{padding: "1rem", minWidth: "3rem", display: "flex", alignItems: "center", justifyContent: "center", background: isWishlist ? "var(--primary)" : "var(--surface)"}}
                  onClick={toggleWishlist}
                  aria-label="Save to Wishlist"
                >
                  {isWishlist ? "🤍" : "♡"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
