import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson } from "../api";
import Header from "../components/Header";
import Hero from "../components/Hero";
import DealsSection from "../components/DealsSection";
import DirectorySection from "../components/DirectorySection";
import MembershipSection from "../components/MembershipSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import PageSkeleton from "../components/PageSkeleton";

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

const countdownStorageKey = "clubDistrictFlashDeadline";

function getOrCreateDeadline() {
  const stored = localStorage.getItem(countdownStorageKey);
  if (stored) {
    const val = Number(stored);
    // If deadline is still in the future, reuse it
    if (val > Date.now()) return val;
  }
  // Otherwise create a new 12-hour window
  const next = Date.now() + 1000 * 60 * 60 * 12;
  localStorage.setItem(countdownStorageKey, String(next));
  return next;
}

function buildCountdown(deadline) {
  const diff = Math.max(deadline - Date.now(), 0);
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
}

export default function HomePage({
  user,
  token,
  wishlist,
  planner,
  setWishlist,
  setPlanner,
  onSyncPreferences,
  onLogout,
  headerProps
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deals, setDeals] = useState([]);
  const [stores, setStores] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [dealFilters, setDealFilters] = useState({ search: "", category: "all" });
  const [storeFilters, setStoreFilters] = useState({ search: "", floor: "all" });
  const [contactForm, setContactForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    interest: ""
  });
  const [contactMessage, setContactMessage] = useState({ text: "", type: "" });
  const [submitting, setSubmitting] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState({ basketValue: 180, groupSize: 3 });
  const [deadline] = useState(() => getOrCreateDeadline());
  const [countdown, setCountdown] = useState(() => buildCountdown(deadline));

  useEffect(() => {
    setContactForm((current) => ({
      ...current,
      name: user?.name || current.name,
      email: user?.email || current.email
    }));
  }, [user]);

  useEffect(() => {
    async function loadPage() {
      try {
        const [dealResponse, storeResponse, eventResponse] = await Promise.all([
          fetchJson("/api/deals"),
          fetchJson("/api/stores"),
          fetchJson("/api/events")
        ]);

        setDeals(dealResponse.data);
        setStores(storeResponse.data);
        setEvents(eventResponse.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(buildCountdown(deadline));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [deadline]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const search = dealFilters.search.toLowerCase();
      const matchesSearch =
        deal.title.toLowerCase().includes(search) ||
        deal.description.toLowerCase().includes(search) ||
        deal.badge.toLowerCase().includes(search);
      const matchesCategory = dealFilters.category === "all" || deal.category === dealFilters.category;
      return matchesSearch && matchesCategory;
    });
  }, [deals, dealFilters]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const search = storeFilters.search.toLowerCase();
      const matchesSearch =
        store.title.toLowerCase().includes(search) ||
        store.type.toLowerCase().includes(search) ||
        store.description.toLowerCase().includes(search);
      const matchesFloor = storeFilters.floor === "all" || store.floor === storeFilters.floor;
      return matchesSearch && matchesFloor;
    });
  }, [stores, storeFilters]);

  const plannerStats = useMemo(() => {
    const selected = deals.filter((deal) => planner.includes(deal._id));
    return {
      count: selected.length,
      spend: selected.reduce((sum, deal) => sum + deal.price, 0),
      savings: selected.reduce((sum, deal) => sum + deal.savings, 0)
    };
  }, [deals, planner]);

  const calculator = useMemo(() => {
    const basketValue = Number(calculatorInput.basketValue) || 0;
    const groupSize = Number(calculatorInput.groupSize) || 1;
    const discount = Math.min(0.08 + (groupSize - 1) * 0.07, 0.52);
    const savings = basketValue * discount;
    return {
      basketValue,
      groupSize,
      savings,
      checkout: Math.max(basketValue - savings, 0),
      discountPercent: Math.round(discount * 100)
    };
  }, [calculatorInput]);

  function handleTogglePlanner(id) {
    setPlanner((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      onSyncPreferences({ wishlist, planner: next });
      return next;
    });
  }

  function handleToggleWishlist(id) {
    setWishlist((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      onSyncPreferences({ wishlist: next, planner });
      return next;
    });
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setContactMessage({ text: "", type: "" });

    try {
      const response = await fetchJson("/api/subscribers", {
        method: "POST",
        token,
        body: JSON.stringify(contactForm)
      });

      setContactMessage({
        text: response.message || `Thanks, ${contactForm.name}. You're on the list.`,
        type: "is-success"
      });
      setContactForm((current) => ({
        name: user?.name || current.name,
        email: user?.email || current.email,
        interest: ""
      }));
    } catch (requestError) {
      setContactMessage({ text: requestError.message, type: "is-error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((value) => !value)}
        wishlistCount={wishlist.length}
        plannerCount={planner.length}
        user={user}
        onLogout={onLogout}
        {...(headerProps || {})}
      />

      <main id="main-content">
        <Hero countdown={countdown} />

        <section className="member-banner section" aria-label="Account status">
          <div className="member-banner-card">
            <div>
              <p className="eyebrow">{user ? "Your club account" : "Unlock the full experience"}</p>
              <h2>{user ? `Welcome back, ${user.name}.` : "Create an account to save your mall plan."}</h2>
              <p>
                {user
                  ? "Your wishlist and planner now sync to your account, so you can return later without losing your picks."
                  : "Register or log in to persist your saved deals, stores, and planning data across visits."}
              </p>
            </div>
            <div className="member-banner-actions">
              {user ? (
                <>
                  <div className="member-stat" aria-label={`${wishlist.length} items in wishlist`}>
                    <span>Wishlist</span>
                    <strong>{wishlist.length}</strong>
                  </div>
                  <div className="member-stat" aria-label={`${planner.length} items in planner`}>
                    <span>Planner</span>
                    <strong>{planner.length}</strong>
                  </div>
                </>
              ) : (
                <>
                  <Link className="primary-button auth-link" to="/register">
                    Register free
                  </Link>
                  <Link className="secondary-button auth-link" to="/login">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="feature-ribbon section" id="discover" aria-label="Key features">
          <article>
            <span aria-hidden="true">01</span>
            <strong>Group buying</strong>
            <p>Join shoppers with matching interests and unlock stacked savings in real time.</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <strong>Creator streams</strong>
            <p>Watch host-led demos before you commit, with instant join buttons right on the page.</p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <strong>Mall planning</strong>
            <p>Build your visit, save stores, and calculate your expected spend before checkout.</p>
          </article>
        </section>

        {loading && <PageSkeleton />}
        {error ? (
          <div className="empty-state section" role="alert">
            <strong>Unable to load content</strong>
            <p>{error}</p>
            <button className="secondary-button" type="button" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <DealsSection
              deals={filteredDeals}
              filters={dealFilters}
              onSearchChange={(event) => setDealFilters((current) => ({ ...current, search: event.target.value }))}
              onCategoryChange={(event) => setDealFilters((current) => ({ ...current, category: event.target.value }))}
              selectedDeals={planner}
              wishlist={wishlist}
              onToggleSelected={handleTogglePlanner}
              onToggleWishlist={handleToggleWishlist}
            />

            <section className="section planner-section" aria-label="Trip planner summary">
              <div className="planner-card">
                <div>
                  <p className="eyebrow">Smart planner</p>
                  <h2>Your mall day, organized</h2>
                  <p>
                    Every deal you join is added to your day plan. Use this as a lightweight cart, itinerary, and savings
                    preview while browsing.
                  </p>
                  {plannerStats.count === 0 && (
                    <p className="planner-cta">
                      <a href="#deals" className="planner-cta-link">Browse deals above</a> and hit "Join deal" to start building your plan.
                    </p>
                  )}
                </div>

                <div className="planner-stats">
                  <article>
                    <span>Items selected</span>
                    <strong>{plannerStats.count}</strong>
                  </article>
                  <article>
                    <span>Total spend</span>
                    <strong>{currency(plannerStats.spend)}</strong>
                  </article>
                  <article>
                    <span>You save</span>
                    <strong className={plannerStats.savings > 0 ? "savings-positive" : ""}>{currency(plannerStats.savings)}</strong>
                  </article>
                </div>
              </div>
            </section>

            <DirectorySection
              stores={filteredStores}
              filters={storeFilters}
              onSearchChange={(event) => setStoreFilters((current) => ({ ...current, search: event.target.value }))}
              onFloorChange={(event) => setStoreFilters((current) => ({ ...current, floor: event.target.value }))}
              wishlist={wishlist}
              onSaveStore={handleToggleWishlist}
            />

            <section className="section events-section" id="events" aria-label="Today's events">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">What's on</p>
                  <h2>Today's calendar at Club District</h2>
                </div>
              </div>

              <div className="event-timeline">
                {events.map((eventItem) => (
                  <article className="event-card" key={eventItem._id}>
                    <div className="event-time">
                      <span>{eventItem.time}</span>
                    </div>
                    <h3>{eventItem.title}</h3>
                    <p>{eventItem.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <MembershipSection
              calculator={calculator}
              onBasketChange={(event) =>
                setCalculatorInput((current) => ({ ...current, basketValue: Number(event.target.value) || 0 }))
              }
              onGroupChange={(event) =>
                setCalculatorInput((current) => ({ ...current, groupSize: Number(event.target.value) || 1 }))
              }
            />

            <FAQSection openIndex={faqOpen} onToggle={(index) => setFaqOpen((current) => (current === index ? null : index))} />

            <section className="section contact-section" aria-label="Newsletter sign up">
              <div className="contact-copy">
                <p className="eyebrow">Stay in the loop</p>
                <h2>Get launch alerts, event invites, and weekly deal recaps</h2>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit} aria-label="Subscribe to newsletter">
                <label>
                  Name
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Your name"
                    required
                    aria-required="true"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="name@example.com"
                    required
                    aria-required="true"
                  />
                </label>
                <label>
                  I'm interested in
                  <select
                    value={contactForm.interest}
                    onChange={(event) => setContactForm((current) => ({ ...current, interest: event.target.value }))}
                    required
                    aria-required="true"
                  >
                    <option value="">Choose one</option>
                    <option value="fashion">Fashion drops</option>
                    <option value="beauty">Beauty and wellness</option>
                    <option value="events">Events and launches</option>
                    <option value="membership">Membership perks</option>
                  </select>
                </label>
                <button className="primary-button" type="submit" disabled={submitting} id="subscribe-btn">
                  {submitting ? "Joining..." : "Join the list"}
                </button>
                <p
                  className={`form-message ${contactMessage.type}`}
                  role={contactMessage.type === "is-error" ? "alert" : "status"}
                >
                  {contactMessage.text}
                </p>
              </form>
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
