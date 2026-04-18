/**
 * Skeleton shimmer loader for the main content sections.
 */
export default function PageSkeleton() {
  return (
    <div className="skeleton-wrapper" aria-label="Loading content..." aria-busy="true">
      {/* Deals skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-heading">
          <div className="skeleton-block skeleton-eyebrow" />
          <div className="skeleton-block skeleton-title" />
        </div>
        <div className="skeleton-grid skeleton-grid-3">
          {[1, 2, 3].map((i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-block skeleton-tag" />
              <div className="skeleton-block skeleton-card-title" />
              <div className="skeleton-block skeleton-card-body" />
              <div className="skeleton-block skeleton-card-body short" />
              <div className="skeleton-actions">
                <div className="skeleton-block skeleton-btn" />
                <div className="skeleton-block skeleton-btn" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory skeleton */}
      <div className="skeleton-section">
        <div className="skeleton-heading">
          <div className="skeleton-block skeleton-eyebrow" />
          <div className="skeleton-block skeleton-title" />
        </div>
        <div className="skeleton-grid skeleton-grid-4">
          {[1, 2, 3, 4].map((i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-block skeleton-tag" />
              <div className="skeleton-block skeleton-card-title" />
              <div className="skeleton-block skeleton-card-body" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
