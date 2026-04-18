import { showToast } from "./ToastProvider";

/**
 * Determine if a store is currently open based on its hours string.
 * Hours format: "10 AM - 10 PM"
 */
function isOpenNow(hoursString) {
  try {
    const now = new Date();
    const [openStr, closeStr] = hoursString.split(" - ");

    function parseTime(str) {
      const match = str.trim().match(/^(\d+)(?::(\d+))?\s*(AM|PM)$/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const mins = parseInt(match[2] || "0", 10);
      const period = match[3].toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const d = new Date(now);
      d.setHours(hours, mins, 0, 0);
      return d;
    }

    const openTime = parseTime(openStr);
    const closeTime = parseTime(closeStr);
    if (!openTime || !closeTime) return null;

    // Handle overnight (e.g. closes at 1 AM next day)
    if (closeTime < openTime) {
      return now >= openTime || now < closeTime;
    }
    return now >= openTime && now < closeTime;
  } catch {
    return null;
  }
}

export default function DirectorySection({ stores, filters, onSearchChange, onFloorChange, wishlist, onSaveStore }) {
  return (
    <section className="section directory-section" id="directory">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Find the right store fast</h2>
        </div>

        <div className="toolbar">
          <label className="search-field">
            <span>Search stores</span>
            <input
              type="search"
              value={filters.search}
              onChange={onSearchChange}
              placeholder="Search brands, food, experiences..."
              aria-label="Search stores"
            />
          </label>

          <label className="select-field">
            <span>Floor</span>
            <select value={filters.floor} onChange={onFloorChange} aria-label="Filter by floor">
              <option value="all">All floors</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="roof">Rooftop</option>
            </select>
          </label>
        </div>
      </div>

      <div className="store-grid">
        {stores.length ? (
          stores.map((store) => {
            const saved = wishlist.includes(store._id);
            const openStatus = isOpenNow(store.hours);

            return (
              <article className="store-card" key={store._id}>
                <div className="store-topline">
                  <span className="store-floor">{store.floor === "roof" ? "Rooftop" : `Level ${store.floor}`}</span>
                  {openStatus !== null && (
                    <span className={`store-status ${openStatus ? "store-open" : "store-closed"}`}>
                      {openStatus ? "● Open" : "○ Closed"}
                    </span>
                  )}
                </div>
                <div>
                  <h3>{store.title}</h3>
                  <p>{store.description}</p>
                </div>
                <div className="store-meta">
                  <span>{store.type}</span>
                  <span>{store.hours}</span>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  aria-pressed={saved}
                  onClick={() => {
                    onSaveStore(store._id);
                    showToast(saved ? `Unsaved "${store.title}"` : `"${store.title}" saved to your list`, "info");
                  }}
                >
                  {saved ? "🤍 Saved" : "Save store"}
                </button>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No stores match those filters right now.</p>
            <p>Try clearing your search or selecting a different floor.</p>
          </div>
        )}
      </div>
    </section>
  );
}
