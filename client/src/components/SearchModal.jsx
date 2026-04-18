import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api";

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();

    async function loadData() {
      try {
        const [dr, sr] = await Promise.all([
          fetchJson("/api/deals"),
          fetchJson("/api/stores"),
        ]);
        setDeals(dr.data);
        setStores(sr.data);
      } catch {}
    }
    loadData();

    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const matchedDeals = useMemo(() =>
    q.length < 2 ? [] : deals.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    ).slice(0, 5),
    [deals, q]
  );

  const matchedStores = useMemo(() =>
    q.length < 2 ? [] : stores.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    ).slice(0, 4),
    [stores, q]
  );

  const hasResults = matchedDeals.length > 0 || matchedStores.length > 0;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Global search"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-modal">
        <div className="search-input-row">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search deals, stores, categories…"
            aria-label="Search"
          />
          <button className="ghost-button" onClick={onClose} aria-label="Close search">✕</button>
        </div>

        {q.length >= 2 && (
          <div className="search-results">
            {!hasResults && (
              <p className="search-empty">No results for "<strong>{query}</strong>"</p>
            )}

            {matchedDeals.length > 0 && (
              <div className="search-group">
                <span className="search-group-label">Deals</span>
                {matchedDeals.map(d => (
                  <Link key={d._id} to={`/deals/${d._id}`} className="search-result-item" onClick={onClose}>
                    <div className="search-result-icon deal-icon">🛍️</div>
                    <div>
                      <strong>{d.title}</strong>
                      <span>${d.price} · Save ${d.savings}</span>
                    </div>
                    <span className="search-result-tag">{d.category}</span>
                  </Link>
                ))}
              </div>
            )}

            {matchedStores.length > 0 && (
              <div className="search-group">
                <span className="search-group-label">Stores</span>
                {matchedStores.map(s => (
                  <Link key={s._id} to={`/stores/${s._id}`} className="search-result-item" onClick={onClose}>
                    <div className="search-result-icon store-icon">🏪</div>
                    <div>
                      <strong>{s.title}</strong>
                      <span>Floor {s.floor} · {s.type}</span>
                    </div>
                    <span className="search-result-tag">{s.hours}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {q.length < 2 && (
          <div className="search-hint">
            <p>Start typing to search across all deals and stores.</p>
            <div className="search-hint-shortcuts">
              <kbd>Esc</kbd> to close
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
