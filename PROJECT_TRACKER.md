# Club-Mall Project Tracker

This document tracks all features added, modified, and pending implementation for the Club-mall web application.

---

## ✅ Completed — Batch 1 (Initial Build)

### Foundational Setup
- [x] Initialized Git repository and synced with GitHub (`NotANUJ005/Club-mall`).
- [x] Full responsive layout with glassmorphism design system.
- [x] Toast notification system (`ToastProvider`).
- [x] Page skeleton loading state (`PageSkeleton`).
- [x] Professional footer with navigation groups.
- [x] 404 Not Found page.

### Core Pages
- [x] **Home Page** — Hero, Deals, Planner, Store Directory, Events, Membership Calculator, Newsletter, FAQ.
- [x] **Auth Pages** — Login, Register, Forgot Password, Reset Password.

### Backend
- [x] MongoDB models: `User`, `Deal`, `Store`, `Event`, `Subscriber`.
- [x] Auth routes: register, login, session restore (`/api/auth/me`), forgot & reset password.
- [x] Content routes: `GET /api/deals`, `GET /api/stores`, `GET /api/events`.
- [x] Subscriber route with duplicate validation.
- [x] JWT-based authentication middleware.
- [x] Wishlist/planner sync (`PATCH /api/users/preferences`).

---

## ✅ Completed — Batch 2 (Feature Expansion)

### New Pages & Routes
- [x] **Deal Details Page (`/deals/:id`)** — Full deal view with Wishlist/Planner toggle, member progress bar, emoji icons.
- [x] **User Profile Page (`/profile`)** — See your saved deals; initially scaffolded.
- [x] **Admin Dashboard (`/admin`)** — Access-controlled panel showing all deals in a table.
- [x] `isAdmin` flag added to `User` model and auth endpoints.

### Navigation
- [x] Deal titles in `DealsSection` now link to `/deals/:id`.
- [x] User pill in `Header` links to `/profile`.
- [x] Profile link added to mobile menu.

### Backend
- [x] `GET /api/deals/:id` endpoint added.

---

## ✅ Completed — Batch 3 (Profile Polish & UX Improvements)

### Profile Page — Fully Rebuilt
- [x] Avatar initial (gradient tile with user's first letter).
- [x] Inline **name editing** with save/cancel flow.
- [x] **Change Password** form (requires current password, min 8 chars, live error messages).
- [x] Wishlist/Planner **tabbed interface** with live counts.
- [x] Each deal in lists is a clickable link to its Detail page.
- [x] Admin badge + link to Admin Dashboard shown for admin users.

### Backend — New User Endpoints
- [x] `PATCH /api/users/profile` — Update display name.
- [x] `PATCH /api/users/change-password` — Verified password change.
- [x] Fixed `isAdmin` missing from `sanitizeUser` in `userRoutes.js`.

### Micro-Interactions & Design
- [x] Deal cards now have a smooth **hover lift animation** (`translateY -4px`).
- [x] Back button on Deal Details uses `navigate(-1)` (respects browser history).
- [x] "My Profile" link added to the site **Footer**.
- [x] Full **Profile Page CSS** system added to `styles.css`.

---

## ⏳ Pending / Backlog

### 1. Payment & Checkout (Requires API Keys)
- [ ] Shopping cart state management.
- [ ] **Stripe** integration for deal purchases/subscriptions.

### 2. Auth Upgrades (Requires API Keys)
- [ ] **Google OAuth** one-click login (requires Google Cloud credentials).
- [ ] **Email Verification** on sign-up (requires SMTP / Resend API key).

### 3. Admin Panel — Full CRUD
- [ ] Create new Deals from the Admin Dashboard (form + POST endpoint).
- [ ] Edit existing Deals (modal form + PUT endpoint).
- [ ] Delete Deals with confirmation prompt (DELETE endpoint).
- [ ] Manage Events and Stores tabs.
- [ ] Image upload for deal/event/store cards.

### 4. Platform Engagement
- [ ] **Review & Rating** system on Deal Details page.
- [ ] Global search bar across deals and stores (frontend + backend text search).
- [ ] **Dark Mode** global toggle (CSS variable swap).
- [ ] Notification/activity feed for group deal updates.
