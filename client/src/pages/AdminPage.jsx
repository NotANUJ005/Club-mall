import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";
import { showToast } from "../components/ToastProvider";

const DEAL_FIELDS = { title: "", category: "fashion", description: "", price: "", savings: "", members: "0", badge: "", eta: "" };
const STORE_FIELDS = { title: "", floor: "1", type: "Fashion", description: "", hours: "" };
const EVENT_FIELDS = { time: "", title: "", description: "" };

function Modal({ title, onClose, onSubmit, submitting, children }) {
  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label={title}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="ghost-button" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit} className="admin-modal-body">
          {children}
          <div className="admin-modal-footer">
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </button>
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel, submitting }) {
  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <div className="admin-modal" style={{ maxWidth: 420 }}>
        <div className="admin-modal-header"><h3>Confirm Delete</h3></div>
        <div className="admin-modal-body">
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{message}</p>
          <div className="admin-modal-footer">
            <button className="primary-button" style={{ background: "linear-gradient(135deg,#a43a22,#d55d3e)" }}
              onClick={onConfirm} disabled={submitting}>
              {submitting ? "Deleting…" : "Delete"}
            </button>
            <button className="secondary-button" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage({ user, token, onLogout }) {
  const [tab, setTab] = useState("deals");
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dealModal, setDealModal] = useState(null);   // null | "create" | deal object
  const [storeModal, setStoreModal] = useState(null);
  const [eventModal, setEventModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type, id, label }
  const [saving, setSaving] = useState(false);

  const [dealForm, setDealForm] = useState(DEAL_FIELDS);
  const [storeForm, setStoreForm] = useState(STORE_FIELDS);
  const [eventForm, setEventForm] = useState(EVENT_FIELDS);

  const isAdmin = user?.isAdmin;

  useEffect(() => {
    async function load() {
      try {
        const [dr, sr, er] = await Promise.all([
          fetchJson("/api/deals"),
          fetchJson("/api/stores"),
          fetchJson("/api/events"),
        ]);
        setDeals(dr.data);
        setStores(sr.data);
        setEvents(er.data);
      } catch (err) {
        showToast("Failed to load data.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!user || !isAdmin) return <Navigate to="/" replace />;

  // ─── Deal CRUD ─────────────────────────────────────────────────────────────

  function openCreateDeal() {
    setDealForm(DEAL_FIELDS);
    setDealModal("create");
  }
  function openEditDeal(deal) {
    setDealForm({ title: deal.title, category: deal.category, description: deal.description, price: deal.price, savings: deal.savings, members: deal.members, badge: deal.badge, eta: deal.eta });
    setDealModal(deal);
  }

  async function handleDealSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = dealModal !== "create";
      const url = isEdit ? `/api/deals/${dealModal._id}` : "/api/deals";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetchJson(url, { method, token, body: JSON.stringify(dealForm) });
      if (isEdit) {
        setDeals(d => d.map(x => x._id === res.data._id ? res.data : x));
        showToast("Deal updated!", "success");
      } else {
        setDeals(d => [res.data, ...d]);
        showToast("Deal created!", "success");
      }
      setDealModal(null);
    } catch (err) {
      showToast(err.message || "Failed to save deal.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteDeal(id) {
    setSaving(true);
    try {
      await fetchJson(`/api/deals/${id}`, { method: "DELETE", token });
      setDeals(d => d.filter(x => x._id !== id));
      showToast("Deal deleted.", "info");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    } finally {
      setSaving(false);
    }
  }

  // ─── Store CRUD ────────────────────────────────────────────────────────────

  function openCreateStore() {
    setStoreForm(STORE_FIELDS);
    setStoreModal("create");
  }
  function openEditStore(store) {
    setStoreForm({ title: store.title, floor: store.floor, type: store.type, description: store.description, hours: store.hours });
    setStoreModal(store);
  }

  async function handleStoreSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const isEdit = storeModal !== "create";
      const url = isEdit ? `/api/stores/${storeModal._id}` : "/api/stores";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetchJson(url, { method, token, body: JSON.stringify(storeForm) });
      if (isEdit) {
        setStores(s => s.map(x => x._id === res.data._id ? res.data : x));
        showToast("Store updated!", "success");
      } else {
        setStores(s => [res.data, ...s]);
        showToast("Store created!", "success");
      }
      setStoreModal(null);
    } catch (err) {
      showToast(err.message || "Failed to save store.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStore(id) {
    setSaving(true);
    try {
      await fetchJson(`/api/stores/${id}`, { method: "DELETE", token });
      setStores(s => s.filter(x => x._id !== id));
      showToast("Store deleted.", "info");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    } finally {
      setSaving(false);
    }
  }

  // ─── Event CRUD ────────────────────────────────────────────────────────────

  function openCreateEvent() {
    setEventForm(EVENT_FIELDS);
    setEventModal("create");
  }

  async function handleEventSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchJson("/api/events", { method: "POST", token, body: JSON.stringify(eventForm) });
      setEvents(ev => [res.data, ...ev]);
      showToast("Event created!", "success");
      setEventModal(null);
    } catch (err) {
      showToast(err.message || "Failed to create event.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(id) {
    setSaving(true);
    try {
      await fetchJson(`/api/events/${id}`, { method: "DELETE", token });
      setEvents(ev => ev.filter(x => x._id !== id));
      showToast("Event deleted.", "info");
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    if (deleteTarget.type === "deal") handleDeleteDeal(deleteTarget.id);
    if (deleteTarget.type === "store") handleDeleteStore(deleteTarget.id);
    if (deleteTarget.type === "event") handleDeleteEvent(deleteTarget.id);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={0} plannerCount={0} />
      <main id="main-content">
        <section className="section" style={{ padding: "2rem 0" }}>
          <div className="admin-header">
            <div>
              <p className="eyebrow">Admin Panel</p>
              <h1>Manage Club District</h1>
            </div>
            <Link to="/" className="secondary-button">← Back to site</Link>
          </div>

          {/* Stats bar */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <span>Deals</span><strong>{deals.length}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Stores</span><strong>{stores.length}</strong>
            </div>
            <div className="admin-stat-card">
              <span>Events</span><strong>{events.length}</strong>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {["deals", "stores", "events"].map(t => (
              <button key={t} className={`admin-tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? <PageSkeleton /> : (

            <>
              {/* DEALS TAB */}
              {tab === "deals" && (
                <div className="admin-section">
                  <div className="admin-section-header">
                    <h2>Deals ({deals.length})</h2>
                    <button className="primary-button" onClick={openCreateDeal}>+ New Deal</button>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th><th>Category</th><th>Price</th><th>Saves</th><th>Members</th><th>ETA</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deals.map(d => (
                          <tr key={d._id}>
                            <td><Link to={`/deals/${d._id}`} style={{ color: "var(--accent-deep)", fontWeight: 600 }}>{d.title}</Link></td>
                            <td><span className="admin-badge">{d.category}</span></td>
                            <td>${d.price}</td>
                            <td className="savings-positive">${d.savings}</td>
                            <td>{d.members}</td>
                            <td>{d.eta}</td>
                            <td>
                              <div className="admin-row-actions">
                                <button className="secondary-button" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => openEditDeal(d)}>Edit</button>
                                <button className="admin-delete-btn" onClick={() => setDeleteTarget({ type: "deal", id: d._id, label: d.title })}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STORES TAB */}
              {tab === "stores" && (
                <div className="admin-section">
                  <div className="admin-section-header">
                    <h2>Stores ({stores.length})</h2>
                    <button className="primary-button" onClick={openCreateStore}>+ New Store</button>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Title</th><th>Floor</th><th>Type</th><th>Hours</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stores.map(s => (
                          <tr key={s._id}>
                            <td style={{ fontWeight: 600 }}>{s.title}</td>
                            <td>Floor {s.floor}</td>
                            <td><span className="admin-badge">{s.type}</span></td>
                            <td>{s.hours}</td>
                            <td>
                              <div className="admin-row-actions">
                                <button className="secondary-button" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => openEditStore(s)}>Edit</button>
                                <button className="admin-delete-btn" onClick={() => setDeleteTarget({ type: "store", id: s._id, label: s.title })}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* EVENTS TAB */}
              {tab === "events" && (
                <div className="admin-section">
                  <div className="admin-section-header">
                    <h2>Events ({events.length})</h2>
                    <button className="primary-button" onClick={openCreateEvent}>+ New Event</button>
                  </div>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Time</th><th>Title</th><th>Description</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(ev => (
                          <tr key={ev._id}>
                            <td><span className="admin-badge">{ev.time}</span></td>
                            <td style={{ fontWeight: 600 }}>{ev.title}</td>
                            <td style={{ color: "var(--muted)", maxWidth: 300 }}>{ev.description}</td>
                            <td>
                              <button className="admin-delete-btn" onClick={() => setDeleteTarget({ type: "event", id: ev._id, label: ev.title })}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />

      {/* ─── Deal Modal ─────────────────────────────────── */}
      {dealModal !== null && (
        <Modal title={dealModal === "create" ? "Create Deal" : "Edit Deal"} onClose={() => setDealModal(null)} onSubmit={handleDealSubmit} submitting={saving}>
          {[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Badge", key: "badge", type: "text", placeholder: "e.g. Fashion, Hot" },
            { label: "ETA", key: "eta", type: "text", placeholder: "e.g. Ships in 2 days" },
            { label: "Price ($)", key: "price", type: "number" },
            { label: "Savings ($)", key: "savings", type: "number" },
            { label: "Members", key: "members", type: "number" },
          ].map(field => (
            <label key={field.key} className="admin-field">
              {field.label}
              <input type={field.type} value={dealForm[field.key]} placeholder={field.placeholder || ""}
                onChange={e => setDealForm(f => ({ ...f, [field.key]: e.target.value }))} required />
            </label>
          ))}
          <label className="admin-field">
            Category
            <select value={dealForm.category} onChange={e => setDealForm(f => ({ ...f, category: e.target.value }))}>
              {["fashion", "beauty", "tech", "dining"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </Modal>
      )}

      {/* ─── Store Modal ─────────────────────────────────── */}
      {storeModal !== null && (
        <Modal title={storeModal === "create" ? "Create Store" : "Edit Store"} onClose={() => setStoreModal(null)} onSubmit={handleStoreSubmit} submitting={saving}>
          {[
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
            { label: "Hours", key: "hours", type: "text", placeholder: "e.g. 10 AM - 10 PM" },
          ].map(field => (
            <label key={field.key} className="admin-field">
              {field.label}
              <input type={field.type} value={storeForm[field.key]} placeholder={field.placeholder || ""}
                onChange={e => setStoreForm(f => ({ ...f, [field.key]: e.target.value }))} required />
            </label>
          ))}
          <label className="admin-field">
            Floor
            <select value={storeForm.floor} onChange={e => setStoreForm(f => ({ ...f, floor: e.target.value }))}>
              {["1", "2", "3", "roof"].map(fl => <option key={fl} value={fl}>{fl === "roof" ? "Rooftop" : `Floor ${fl}`}</option>)}
            </select>
          </label>
          <label className="admin-field">
            Type
            <select value={storeForm.type} onChange={e => setStoreForm(f => ({ ...f, type: e.target.value }))}>
              {["Fashion", "Beauty", "Tech", "Dining", "Cafe", "Wellness", "Lifestyle", "Family"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </Modal>
      )}

      {/* ─── Event Modal ─────────────────────────────────── */}
      {eventModal !== null && (
        <Modal title="Create Event" onClose={() => setEventModal(null)} onSubmit={handleEventSubmit} submitting={saving}>
          {[
            { label: "Time", key: "time", type: "text", placeholder: "e.g. 3:30 PM" },
            { label: "Title", key: "title", type: "text" },
            { label: "Description", key: "description", type: "text" },
          ].map(field => (
            <label key={field.key} className="admin-field">
              {field.label}
              <input type={field.type} value={eventForm[field.key]} placeholder={field.placeholder || ""}
                onChange={e => setEventForm(f => ({ ...f, [field.key]: e.target.value }))} required />
            </label>
          ))}
        </Modal>
      )}

      {/* ─── Delete Confirm ───────────────────────────────── */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.label}"? This cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          submitting={saving}
        />
      )}
    </div>
  );
}
