import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";

export default function AdminPage({ user, onLogout }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetchJson("/api/deals");
        setDeals(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!user || (!user.isAdmin && user.email !== "admin@clubdistrict.com")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={0} plannerCount={0} />
      <main id="main-content">
        <section className="section" style={{maxWidth: "1000px", margin: "0 auto", padding: "4rem 1rem"}}>
          <h1>Admin Dashboard</h1>
          <p>Welcome to the admin panel. Here you can manage your platform data.</p>
          
          {loading ? <PageSkeleton /> : (
            <div style={{marginTop: "2rem"}}>
              <h2>Manage Deals ({deals.length})</h2>
              <table style={{width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                <thead>
                  <tr style={{textAlign: "left", background: "var(--surface)", borderBottom: "2px solid var(--border)"}}>
                    <th style={{padding: "1rem"}}>Title</th>
                    <th style={{padding: "1rem"}}>Category</th>
                    <th style={{padding: "1rem"}}>Price</th>
                    <th style={{padding: "1rem"}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map(d => (
                    <tr key={d._id} style={{borderBottom: "1px solid var(--border)"}}>
                      <td style={{padding: "1rem"}}>{d.title}</td>
                      <td style={{padding: "1rem"}}>{d.category}</td>
                      <td style={{padding: "1rem"}}>${d.price}</td>
                      <td style={{padding: "1rem"}}>
                        <button className="secondary-button" style={{padding: "0.25rem 0.5rem", fontSize: "0.875rem"}}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
