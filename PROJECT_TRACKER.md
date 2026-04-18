# Club-Mall Project Tracker

> Last updated: Auto-updated every development batch. Production-ready status below.

---

## ✅ Completed — Batch 1 (Initial Build)

### Core Infrastructure
- [x] Git repository initialized and synced with GitHub (`NotANUJ005/Club-mall`)
- [x] Full responsive layout with glassmorphism design system
- [x] Toast notification system (`ToastProvider`)
- [x] Page skeleton loading state (`PageSkeleton`)
- [x] Professional footer with navigation groups
- [x] 404 Not Found page
- [x] CORS restriction to known origins

### Core Pages
- [x] **Home Page** — Hero, Deals, Planner, Store Directory, Events, Membership Calculator, Newsletter, FAQ
- [x] **Auth Pages** — Login, Register, Forgot Password, Reset Password

### Backend
- [x] MongoDB models: `User`, `Deal`, `Store`, `Event`, `Subscriber`
- [x] Auth routes with JWT session management
- [x] Content routes for deals, stores, events
- [x] Subscriber route with duplicate validation
- [x] Wishlist/planner sync (`PATCH /api/users/preferences`)

---

## ✅ Completed — Batch 2 (Feature Expansion)

- [x] **Deal Details Page (`/deals/:id`)** with wishlist/planner toggle
- [x] **User Profile Page (`/profile`)**
- [x] **Admin Dashboard (`/admin`)**
- [x] `isAdmin` flag on `User` model and all auth endpoints
- [x] `GET /api/deals/:id` endpoint

---

## ✅ Completed — Batch 3 (Profile Polish & UX)

- [x] Inline **name editing** with save/cancel flow
- [x] **Change Password** form with current-password verification
- [x] Wishlist/Planner **tabbed interface** with live counts
- [x] `PATCH /api/users/profile` & `PATCH /api/users/change-password`
- [x] Fixed: `isAdmin` missing from `userRoutes.js` `sanitizeUser`
- [x] Deal card **hover lift animation**
- [x] Back button uses `navigate(-1)` (browser history)
- [x] "My Profile" in Footer

---

## ✅ Completed — Batch 4 (Major Feature Expansion)

### Dark Mode
- [x] Full dark mode — CSS `[data-theme="dark"]` variable overrides
- [x] 🌙/☀️ toggle in Header, persisted in `localStorage`

### Admin Dashboard — Full CRUD
- [x] `requireAdmin` middleware added to `authMiddleware.js`
- [x] Deals, Stores, Events — Create, Edit/Update, Delete
- [x] Modal forms with validation and confirm-delete dialog
- [x] All admin API endpoints protected server-side

### Global Search
- [x] 🔍 Search modal (Spotlight-style) in Header
- [x] Real-time filtering across Deals and Stores
- [x] `Esc` keyboard shortcut to close

### Reviews & Ratings
- [x] `Review` Mongoose model with compound index
- [x] `GET`, `POST`, `DELETE` review API routes
- [x] Interactive 5-star picker with hover animation
- [x] One review per user per deal enforced
- [x] Admins can delete any review

### New Pages
- [x] **Store Details (`/stores/:id`)** — icon, open/closed, info cards
- [x] `GET /api/stores/:id` endpoint
- [x] Store titles in Directory link to detail pages

---

## ✅ Completed — Batch 5 (Production Hardening)

### Security
- [x] **Rate limiting** — `express-rate-limit` installed and configured
  - Global limiter: 200 req / 15 min
  - Auth limiter: 20 req / 15 min (applied to login/register)
- [x] Extra security headers: `X-XSS-Protection`, `Permissions-Policy`
- [x] `Strict-Transport-Security` header in production mode
- [x] Structured error logging with timestamp and method/path context
- [x] Stack traces hidden in production error responses
- [x] 404 handler for unknown `/api/*` routes
- [x] `NODE_ENV`-aware environment management
- [x] `.env.example` with all required variables documented

### Frontend Architecture
- [x] **React Error Boundary** — catches all JS runtime errors gracefully
- [x] **Lazy loading** — all pages loaded with `React.lazy()` + `Suspense` for code splitting
- [x] **ScrollToTop** — resets scroll position on every route change
- [x] **`usePageTitle` hook** — dynamic `<title>` per page/deal/store
- [x] **Skip to main content** link — keyboard/screen reader accessibility
- [x] **`:focus-visible`** styles for keyboard navigation
- [x] Password strength meter on Register page
- [x] Show/hide password toggle on all password fields
- [x] `autoComplete` attributes on all auth inputs
- [x] **Web Share API** share button on Deal Details page (fallback to clipboard)

### Build & Deployment
- [x] Vite config updated with manual chunk splitting (vendor-react separate chunk)
- [x] `robots.txt` — blocks `/admin` and `/api/` from search indexing
- [x] `_redirects` file for SPA routing on Netlify/Cloudflare Pages
- [x] `form-message.is-success` CSS class for positive feedback

---

## ⏳ Pending / Backlog

### Payment & Checkout (Requires Stripe API Key)
- [ ] Shopping cart state (`CartContext`)
- [ ] Stripe integration for deal purchases and subscriptions
- [ ] Order history model and route

### Auth Upgrades (Require External Keys)
- [ ] **Google OAuth** one-click sign-in (requires Google Cloud credentials)
- [ ] **Real email verification** on sign-up (requires SMTP/Resend API key)
- [ ] **Magic link / passwordless login**

### Admin Enhancements
- [ ] Image upload for deal/store/event cards (requires Cloudinary or S3)
- [ ] User management tab (view all users, toggle `isAdmin`)
- [ ] Analytics dashboard (subscriber count, most wishlisted deals, revenue)
- [ ] Rich text editor for deal descriptions

### Performance & SEO
- [ ] Sitemap XML generation (`/sitemap.xml` endpoint)
- [ ] Open Graph image generation per deal
- [ ] Pagination for deal/store listings
- [ ] Infinite scroll or load-more on homepage sections

### Platform Engagement
- [ ] Notification/activity feed for group deal updates
- [ ] Social sharing with custom Open Graph previews
- [ ] Deal countdown timers with real scheduling
