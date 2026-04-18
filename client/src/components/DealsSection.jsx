import { useEffect } from "react";
import { showToast } from "./ToastProvider";

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export default function DealsSection({
  deals,
  filters,
  onSearchChange,
  onCategoryChange,
  selectedDeals,
  wishlist,
  onToggleSelected,
  onToggleWishlist
}) {
  return (
    <section className="section deals-section" id="deals">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Group deals</p>
          <h2>Live drops worth joining</h2>
        </div>

        <div className="toolbar">
          <label className="search-field">
            <span>Search deals</span>
            <input
              type="search"
              value={filters.search}
              onChange={onSearchChange}
              placeholder="Try sneakers, skincare, lounge..."
              aria-label="Search deals"
            />
          </label>

          <label className="select-field">
            <span>Category</span>
            <select value={filters.category} onChange={onCategoryChange} aria-label="Filter by category">
              <option value="all">All</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty</option>
              <option value="tech">Tech</option>
              <option value="dining">Dining</option>
            </select>
          </label>
        </div>
      </div>

      <div className="deal-grid">
        {deals.length ? (
          deals.map((deal) => {
            const selected = selectedDeals.includes(deal._id);
            const saved = wishlist.includes(deal._id);

            return (
              <article className={`deal-card ${selected ? "deal-card-selected" : ""}`} key={deal._id}>
                <div className="deal-topline">
                  <span className="deal-tag">{deal.badge}</span>
                  <span className="deal-eta">{deal.eta}</span>
                </div>
                <div>
                  <h3>{deal.title}</h3>
                  <p>{deal.description}</p>
                </div>
                <div className="deal-stats">
                  <span>{currency(deal.price)} live price</span>
                  <span className="stat-savings">Save {currency(deal.savings)}</span>
                  <span>{deal.members} joined</span>
                </div>
                <div className="deal-actions">
                  <button
                    className={`${selected ? "primary-button-active" : "primary-button"}`}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      onToggleSelected(deal._id);
                      showToast(
                        selected ? `Removed "${deal.title}" from your plan` : `"${deal.title}" added to your plan`,
                        selected ? "info" : "success"
                      );
                    }}
                  >
                    {selected ? "✓ In your plan" : "Join deal"}
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    aria-pressed={saved}
                    onClick={() => {
                      onToggleWishlist(deal._id);
                      showToast(
                        saved ? `Removed from wishlist` : `"${deal.title}" wishlisted`,
                        "info"
                      );
                    }}
                  >
                    {saved ? "🤍 Saved" : "Wishlist"}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No deals match this search yet.</p>
            <p>Try another keyword or category, or clear your filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
