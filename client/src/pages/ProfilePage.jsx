import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";
import { showToast } from "../components/ToastProvider";

export default function ProfilePage({ user, setUser, token, onLogout, wishlist, planner }) {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit name state
  const [nameEdit, setNameEdit] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || "");
  const [nameSaving, setNameSaving] = useState(false);

  // Change password state
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState({ text: "", type: "" });

  // Active tab
  const [tab, setTab] = useState("wishlist");

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

  if (!user) return <Navigate to="/login" replace />;

  const wishlistedDeals = deals.filter(d => wishlist.includes(d._id));
  const plannedDeals = deals.filter(d => planner.includes(d._id));

  async function handleNameSave(e) {
    e.preventDefault();
    if (!nameValue.trim()) return;
    setNameSaving(true);
    try {
      const res = await fetchJson("/api/users/profile", {
        method: "PATCH",
        token,
        body: JSON.stringify({ name: nameValue.trim() })
      });
      if (setUser) setUser(res.user);
      setNameEdit(false);
      showToast("Name updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to update name.", "error");
    } finally {
      setNameSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwMessage({ text: "", type: "" });
    setPwSaving(true);
    try {
      const res = await fetchJson("/api/users/change-password", {
        method: "PATCH",
        token,
        body: JSON.stringify(pwForm)
      });
      setPwMessage({ text: res.message, type: "success" });
      setPwForm({ currentPassword: "", newPassword: "" });
      showToast("Password changed!", "success");
    } catch (err) {
      setPwMessage({ text: err.message || "Failed to change password.", type: "error" });
    } finally {
      setPwSaving(false);
    }
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={wishlist.length} plannerCount={planner.length} />
      <main id="main-content">
        <section className="section profile-section">

          {/* ── Header Row ── */}
          <div className="profile-hero">
            <div className="profile-avatar" aria-hidden="true">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <p className="eyebrow">{user.isAdmin ? "Administrator" : "Club member"}</p>
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
            {user.isAdmin && (
              <Link to="/admin" className="primary-button" style={{ marginLeft: "auto", alignSelf: "center" }}>
                Admin Dashboard →
              </Link>
            )}
          </div>

          <div className="profile-grid">

            {/* ── Left panel: account settings ── */}
            <div className="profile-settings">
              <div className="profile-card">
                <strong className="profile-card-title">Account Details</strong>

                {/* Name */}
                {nameEdit ? (
                  <form onSubmit={handleNameSave} className="profile-inline-form">
                    <label>
                      Display name
                      <input
                        type="text"
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        autoFocus
                        required
                      />
                    </label>
                    <div className="profile-form-actions">
                      <button className="primary-button" type="submit" disabled={nameSaving}>
                        {nameSaving ? "Saving…" : "Save"}
                      </button>
                      <button className="secondary-button" type="button" onClick={() => { setNameEdit(false); setNameValue(user.name); }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-field-row">
                    <div>
                      <span className="profile-field-label">Name</span>
                      <span className="profile-field-value">{user.name}</span>
                    </div>
                    <button className="ghost-button" onClick={() => setNameEdit(true)}>Edit</button>
                  </div>
                )}

                <div className="profile-field-row">
                  <div>
                    <span className="profile-field-label">Email</span>
                    <span className="profile-field-value">{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Password change */}
              <div className="profile-card">
                <strong className="profile-card-title">Change Password</strong>
                <form onSubmit={handlePasswordChange} className="profile-inline-form">
                  <label>
                    Current password
                    <input
                      type="password"
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    New password <small style={{ color: "var(--muted)" }}>(min. 8 chars)</small>
                    <input
                      type="password"
                      value={pwForm.newPassword}
                      onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                      required
                      minLength={8}
                    />
                  </label>
                  {pwMessage.text && (
                    <p className={`form-message ${pwMessage.type === "success" ? "is-success" : "is-error"}`} role="alert">
                      {pwMessage.text}
                    </p>
                  )}
                  <button className="primary-button" type="submit" disabled={pwSaving}>
                    {pwSaving ? "Updating…" : "Update password"}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Right panel: wishlist / planner tabs ── */}
            <div className="profile-saves">
              <div className="profile-tabs" role="tablist">
                <button
                  role="tab"
                  aria-selected={tab === "wishlist"}
                  className={tab === "wishlist" ? "profile-tab active" : "profile-tab"}
                  onClick={() => setTab("wishlist")}
                >
                  🤍 Wishlist <span className="profile-tab-count">{wishlistedDeals.length}</span>
                </button>
                <button
                  role="tab"
                  aria-selected={tab === "planner"}
                  className={tab === "planner" ? "profile-tab active" : "profile-tab"}
                  onClick={() => setTab("planner")}
                >
                  📋 Planner <span className="profile-tab-count">{plannedDeals.length}</span>
                </button>
              </div>

              {loading ? (
                <PageSkeleton />
              ) : (
                <div className="profile-deal-list" role="tabpanel">
                  {(tab === "wishlist" ? wishlistedDeals : plannedDeals).length === 0 ? (
                    <div className="empty-state">
                      <p><strong>{tab === "wishlist" ? "No wishlisted deals." : "No deals in your planner."}</strong></p>
                      <p>Head back to the <Link to="/#deals" className="planner-cta-link">deals section</Link> to add some.</p>
                    </div>
                  ) : (
                    (tab === "wishlist" ? wishlistedDeals : plannedDeals).map(deal => (
                      <Link to={`/deals/${deal._id}`} key={deal._id} className="profile-deal-item">
                        <div>
                          <strong>{deal.title}</strong>
                          <span>{deal.category}</span>
                        </div>
                        <div className="profile-deal-price">
                          <strong>${deal.price}</strong>
                          <span className="stat-savings" style={{ borderRadius: "999px", padding: "4px 8px" }}>
                            Save ${deal.savings}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
