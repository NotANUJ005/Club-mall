function pad(value) {
  return String(value).padStart(2, "0");
}

export default function Hero({ countdown }) {
  return (
    <section className="hero section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Inspired by Clubmall's social-commerce energy</p>
        <h1>Shop together, save bigger, and turn every visit into an event.</h1>
        <p className="hero-text">
          Club District blends a premium mall homepage with the community feel of social shopping. Discover group
          deals, follow live drops, plan your day, and unlock member-only rewards.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#deals">
            Explore today's drops
          </a>
          <a className="secondary-button" href="#membership">
            See membership perks
          </a>
        </div>

        <div className="hero-metrics">
          <article>
            <strong>120+</strong>
            <span>brands live this week</span>
          </article>
          <article>
            <strong>68%</strong>
            <span>avg. group savings</span>
          </article>
          <article>
            <strong>24/7</strong>
            <span>creator-led product streams</span>
          </article>
        </div>
      </div>

      <div className="hero-panel">
        <div className="countdown-card">
          <p className="card-label">Flash window closes in</p>
          <div className="countdown">
            <div>
              <strong>{pad(countdown.hours)}</strong>
              <span>hours</span>
            </div>
            <div>
              <strong>{pad(countdown.minutes)}</strong>
              <span>minutes</span>
            </div>
            <div>
              <strong>{pad(countdown.seconds)}</strong>
              <span>seconds</span>
            </div>
          </div>
        </div>

        <div className="panel-stack">
          <article className="floating-card accent-peach">
            <p>Trending live</p>
            <strong>Luxury beauty bundles</strong>
            <span>12 groups forming now</span>
          </article>
          <article className="floating-card accent-gold">
            <p>Fastest growing</p>
            <strong>Streetwear night drop</strong>
            <span>1.8k saves in 2 hours</span>
          </article>
          <article className="floating-card accent-blue">
            <p>Members only</p>
            <strong>Private lounge RSVP</strong>
            <span>Early access tonight</span>
          </article>
        </div>
      </div>
    </section>
  );
}
