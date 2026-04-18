import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";

export default function ProfilePage({ user, onLogout, wishlist, planner }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const response = await fetchJson("/api/deals");
        setDeals(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const wishlistedDeals = deals.filter(d => wishlist.includes(d._id));
  const plannedDeals = deals.filter(d => planner.includes(d._id));

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={wishlist.length} plannerCount={planner.length} />
      <main id="main-content">
        <section className="section" style={{maxWidth: "800px", margin: "0 auto", padding: "4rem 1rem"}}>
          <h1>Your Profile</h1>
          <div className="profile-details" style={{background: "var(--surface)", padding: "2rem", borderRadius: "12px", marginBottom: "2rem"}}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.isAdmin && <p><strong>Role:</strong> Administrator</p>}
            {user.isAdmin && (
              <Link to="/admin" className="primary-button" style={{marginTop: "1rem", display: "inline-block"}}>
                Go to Admin Dashboard
              </Link>
            )}
          </div>
          
          {loading ? <PageSkeleton /> : (
            <div className="profile-lists">
              <h2>Your Wishlist ({wishlistedDeals.length})</h2>
              {wishlistedDeals.length === 0 ? <p>No items in your wishlist.</p> : (
                <ul style={{listStyle: "none", padding: 0, marginBottom: "2rem"}}>
                  {wishlistedDeals.map(d => (
                    <li key={d._id} style={{padding: "1rem", background: "var(--surface)", marginBottom: "0.5rem", borderRadius: "8px"}}>
                      <Link to={`/deals/${d._id}`}><strong>{d.title}</strong> - ${d.price}</Link>
                    </li>
                  ))}
                </ul>
              )}

              <h2>Your Planner ({plannedDeals.length})</h2>
              {plannedDeals.length === 0 ? <p>No items in your planner.</p> : (
                <ul style={{listStyle: "none", padding: 0}}>
                  {plannedDeals.map(d => (
                    <li key={d._id} style={{padding: "1rem", background: "var(--surface)", marginBottom: "0.5rem", borderRadius: "8px"}}>
                      <Link to={`/deals/${d._id}`}><strong>{d.title}</strong> - ${d.price}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
