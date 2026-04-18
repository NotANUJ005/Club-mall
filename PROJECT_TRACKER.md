# Club-Mall Project Tracker

This document tracks all features added, modified, and pending implementation.
Auto-updated with every development batch.

---

## ✅ Completed — Batch 1 (Initial Build)

### Foundational Setup
- [x] Initialized Git repository and synced with GitHub (`NotANUJ005/Club-mall`)
- [x] Full responsive layout with glassmorphism design system
- [x] Toast notification system (`ToastProvider`)
- [x] Page skeleton loading state (`PageSkeleton`)
- [x] Professional footer with navigation groups
- [x] 404 Not Found page

### Core Pages
- [x] **Home Page** — Hero, Deals, Planner, Store Directory, Events, Membership Calculator, Newsletter, FAQ
- [x] **Auth Pages** — Login, Register, Forgot Password, Reset Password

### Backend
- [x] MongoDB models: `User`, `Deal`, `Store`, `Event`, `Subscriber`
- [x] Auth routes: register, login, `/api/auth/me`, forgot & reset password
- [x] Content routes: `GET /api/deals`, `GET /api/stores`, `GET /api/events`
- [x] Subscriber route with duplicate validation
- [x] JWT-based authentication middleware
- [x] Wishlist/planner sync (`PATCH /api/users/preferences`)

---

## ✅ Completed — Batch 2 (Feature Expansion)

### New Pages & Routes
- [x] **Deal Details Page (`/deals/:id`)** — Dynamic route with rich UI
- [x] **User Profile Page (`/profile`)** — Initial scaffolding
- [x] **Admin Dashboard (`/admin`)** — Access-controlled stub
- [x] `isAdmin` flag added to `User` model and auth endpoints

### Navigation
- [x] Deal titles in `DealsSection` link to `/deals/:id`
- [x] User pill in `Header` links to `/profile`
- [x] Profile link added to mobile menu

### Backend
- [x] `GET /api/deals/:id` endpoint added

---

## ✅ Completed — Batch 3 (Profile Polish & UX)

### Profile Page — Fully Rebuilt
- [x] Avatar initial (gradient tile with user's first letter)
- [x] Inline **name editing** with save/cancel
- [x] **Change Password** form with current-password verification
- [x] Wishlist/Planner **tabbed interface** with live counts
- [x] Each deal in lists links to its Deal Detail page
- [x] Admin badge + link to Admin Dashboard for admin users

### Backend — New User Endpoints
- [x] `PATCH /api/users/profile` — Update display name
- [x] `PATCH /api/users/change-password` — Verified password change
- [x] Fixed: `isAdmin` missing from `sanitizeUser` in `userRoutes.js`

### Micro-Interactions & Design
- [x] Deal cards have smooth **hover lift animation**
- [x] Back button on Deal Details uses `navigate(-1)` (browser history)
- [x] "My Profile" link added to the site Footer
- [x] Full Profile Page CSS system in `styles.css`

---

## ✅ Completed — Batch 4 (Major Autonomous Expansion)

### Dark Mode
- [x] 🌙 **Full Dark Mode** — persisted in `localStorage`, toggled via Header button
- [x] CSS `[data-theme="dark"]` variable overrides for all components
- [x] Smooth theme persistence across page reloads

### Admin Dashboard — Full CRUD
- [x] **`requireAdmin` middleware** added to `authMiddleware.js`
- [x] **Deals** — Create, Edit, Delete from Admin UI
- [x] **Stores** — Create, Edit, Delete from Admin UI
- [x] **Events** — Create, Delete from Admin UI
- [x] Stats summary bar (deal/store/event counts)
- [x] Tabbed interface (Deals / Stores / Events)
- [x] Modal forms for Create/Edit with validation
- [x] Confirm-delete modal with danger styling
- [x] All admin API routes secured with `requireAuth + requireAdmin`

### Global Search
- [x] 🔍 **Search Modal** — opened from Header (keyboard shortcut `Esc` to close)
- [x] Real-time filtering across **Deals** and **Stores**
- [x] Grouped, linked results with category badges
- [x] Available on both desktop and mobile nav

### Ratings & Reviews
- [x] `Review` MongoDB model (dealId, userId, rating 1–5, comment)
- [x] `reviewRoutes.js` — `GET`, `POST`, `DELETE`
- [x] Registered in `server.js`
- [x] **Star Rating UI** — interactive 5-star picker with hover effect
- [x] Review form on Deal Details page (Auth required)
- [x] Review list with avatar initials, star display, dates
- [x] Users can delete their own reviews; Admins can delete any review
- [x] One review per user per deal enforced

### New Pages & Routing
- [x] **`/stores/:id`** — Store Details page with icon, open/closed status, hours card
- [x] Store titles in `DirectorySection` now link to store detail pages
- [x] `GET /api/stores/:id` backend endpoint

### Design Improvements
- [x] Fully rebuilt **Deal Details page** with progress bar, better layout, emoji icons
- [x] Admin link added to Header mobile menu for admin users
- [x] All new components have comprehensive responsive CSS

---

## ⏳ Pending / Backlog

### Payment & Checkout (Requires Stripe API Key)
- [ ] Shopping cart state management
- [ ] Stripe integration for deal purchases

### Auth Upgrades (Require 3rd Party Keys)
- [ ] **Google OAuth** one-click login (requires Google Cloud credentials)
- [ ] **Real Email Verification** on sign-up (requires SMTP/Resend API key)

### Admin Enhancements
- [ ] Image upload for deal/store/event cards (requires file storage like Cloudinary)
- [ ] User management tab (view all users, toggle `isAdmin`)
- [ ] Analytics tab (subscriber count, most wishlisted deals)

### Platform Engagement
- [ ] Notification/activity feed for group deal updates
- [ ] Pagination for deals and stores when DB has many records
