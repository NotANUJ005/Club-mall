import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";
import { fetchJson } from "../api";
import { showToast } from "../components/ToastProvider";

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-row" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hover || value) ? "star-filled" : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
        >★</button>
      ))}
    </div>
  );
}

function ReviewCard({ review, canDelete, onDelete }) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">{review.userName[0].toUpperCase()}</div>
        <div>
          <strong>{review.userName}</strong>
          <span className="review-stars">{stars}</span>
        </div>
        <span className="review-date">{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        {canDelete && (
          <button className="admin-delete-btn" style={{ marginLeft: "auto" }} onClick={() => onDelete(review._id)}>Remove</button>
        )}
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );
}

export default function DealPage({ user, token, onLogout, wishlist, planner, setWishlist, setPlanner }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadAll() {
      try {
        const [dealRes, reviewRes] = await Promise.all([
          fetchJson(`/api/deals/${id}`),
          fetchJson(`/api/reviews/${id}`)
        ]);
        setDeal(dealRes.data);
        setReviews(reviewRes.data);
      } catch (err) {
        setError("Could not load deal details.");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [id]);

  if (loading) return <div className="page-shell"><PageSkeleton /></div>;

  if (error || !deal) {
    return (
      <div className="page-shell">
        <Header user={user} onLogout={onLogout} wishlistCount={wishlist?.length || 0} plannerCount={planner?.length || 0} />
        <main id="main-content" style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <h1>Deal Not Found</h1>
          <p>{error || "This deal may have expired."}</p>
          <button onClick={() => navigate(-1)} className="primary-button" style={{ marginTop: "2rem" }}>Go Back</button>
        </main>
        <Footer />
      </div>
    );
  }

  const isPlanner = planner?.includes(deal._id);
  const isWishlist = wishlist?.includes(deal._id);
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const hasReviewed = user && reviews.some(r => r.userId === String(user._id));

  function togglePlanner() {
    if (!user) { showToast("Log in to plan your deals.", "info"); return; }
    setPlanner(curr => curr.includes(deal._id) ? curr.filter(d => d !== deal._id) : [...curr, deal._id]);
    showToast(isPlanner ? "Removed from planner." : `"${deal.title}" added to plan!`, "success");
  }

  function toggleWishlist() {
    if (!user) { showToast("Log in to save items.", "info"); return; }
    setWishlist(curr => curr.includes(deal._id) ? curr.filter(d => d !== deal._id) : [...curr, deal._id]);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (reviewForm.rating === 0) { showToast("Please select a star rating.", "info"); return; }
    setReviewSubmitting(true);
    try {
      const res = await fetchJson(`/api/reviews/${id}`, {
        method: "POST",
        token,
        body: JSON.stringify(reviewForm)
      });
      setReviews(rv => [res.data, ...rv]);
      setReviewForm({ rating: 0, comment: "" });
      showToast("Review posted!", "success");
    } catch (err) {
      showToast(err.message || "Could not post review.", "error");
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    try {
      await fetchJson(`/api/reviews/${reviewId}`, { method: "DELETE", token });
      setReviews(rv => rv.filter(r => r._id !== reviewId));
      showToast("Review removed.", "info");
    } catch (err) {
      showToast(err.message || "Could not remove review.", "error");
    }
  }

  const badgeEmoji = deal.badge === "Hot" ? "🔥" : deal.badge === "New" ? "✨" : deal.badge === "Tech" ? "🎧" : deal.badge === "Beauty" ? "💄" : "🛍️";

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} wishlistCount={wishlist?.length || 0} plannerCount={planner?.length || 0} />
      <main id="main-content">
        <section className="section deal-detail-section">
          <button onClick={() => navigate(-1)} className="secondary-button deal-back-btn">
            ← Back
          </button>

          <div className="deal-detail-grid">
            {/* Left: image area */}
            <div className="deal-detail-image">
              <div className="deal-detail-emoji">{badgeEmoji}</div>
              <div className="deal-detail-stats-row">
                <div className="deal-detail-stat">
                  <span>Members joined</span>
                  <strong>{deal.members}</strong>
                </div>
                <div className="deal-detail-stat">
                  <span>Avg. rating</span>
                  <strong>{avgRating ? `${avgRating} ★` : "No reviews"}</strong>
                </div>
              </div>
            </div>

            {/* Right: info */}
            <div className="deal-detail-info">
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <span className="deal-tag">{deal.badge}</span>
                <span className="deal-eta">{deal.eta}</span>
              </div>
              <h1 className="deal-detail-title">{deal.title}</h1>
              <p className="deal-detail-desc">{deal.description}</p>

              <div className="deal-detail-pricing">
                <div>
                  <span>Price</span>
                  <strong>${deal.price}</strong>
                </div>
                <div>
                  <span>You Save</span>
                  <strong className="savings-positive">${deal.savings}</strong>
                </div>
              </div>

              {/* Progress */}
              <div className="deal-detail-progress">
                <div className="deal-progress-meta">
                  <span><strong>{deal.members}</strong> members joined</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Deal closes {deal.eta}</span>
                </div>
                <div className="deal-progress-bar">
                  <div className="deal-progress-fill" style={{ width: `${Math.min((deal.members / 50) * 100, 100)}%` }} />
                </div>
              </div>

              {/* Actions */}
              <div className="deal-detail-actions">
                <button
                  className={isPlanner ? "primary-button-active" : "primary-button"}
                  style={{ flex: 1, padding: "14px" }}
                  onClick={togglePlanner}
                >
                  {isPlanner ? "✓ In your plan" : "Join deal"}
                </button>
                <button
                  className="secondary-button"
                  style={{ padding: "14px 18px" }}
                  onClick={toggleWishlist}
                  aria-label={isWishlist ? "Remove from wishlist" : "Save to wishlist"}
                >
                  {isWishlist ? "🤍" : "♡"}
                </button>
              </div>
            </div>
          </div>

          {/* ─── Reviews ─────────────────────────────────── */}
          <div className="reviews-section">
            <div className="reviews-heading">
              <h2>Reviews {reviews.length > 0 && <span className="reviews-count">{reviews.length}</span>}</h2>
              {avgRating && <span className="reviews-avg">{avgRating} ★ average</span>}
            </div>

            {/* Review form */}
            {user && !hasReviewed && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <strong>Leave a review</strong>
                <StarRating value={reviewForm.rating} onChange={r => setReviewForm(f => ({ ...f, rating: r }))} />
                <textarea
                  className="review-textarea"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="What did you think of this deal?"
                  rows={3}
                  required
                  minLength={5}
                />
                <button className="primary-button" type="submit" disabled={reviewSubmitting} style={{ justifySelf: "start" }}>
                  {reviewSubmitting ? "Posting…" : "Post review"}
                </button>
              </form>
            )}
            {!user && (
              <p className="review-login-prompt">
                <a href="/login" style={{ color: "var(--accent-deep)", fontWeight: 700 }}>Log in</a> to leave a review.
              </p>
            )}

            {/* Review list */}
            <div className="review-list">
              {reviews.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>No reviews yet. Be the first!</p>
              ) : (
                reviews.map(r => (
                  <ReviewCard
                    key={r._id}
                    review={r}
                    canDelete={user && (r.userId === String(user._id) || user.isAdmin)}
                    onDelete={handleDeleteReview}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
