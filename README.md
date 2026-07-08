# Aurelia Jewels

Full-stack jewelry e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

> **Tagline:** *"Wear the Warmth of Gold."*

## Features

- **Dynamic product catalog** — admin CRUD for products, categories, pricing
- **Live gold-rate pricing** — prices computed server-side from configurable daily rates (gold rate × weight + making charge + GST)
- **Price calculator** — per-product and bulk cart pricing with full GST breakdown
- **RBAC (Role-Based Access Control)** — 6 default roles with granular permissions
- **Full admin dashboard** — manage products, orders, users, roles, coupons, banners, gold rates, reviews
- **Cart & checkout** — guest cart with session-based persistence, merge on login, Razorpay + COD payment
- **Coupon system** — flat or percentage discounts with usage limits and min-order values
- **Wishlist** — toggle add/remove, persisted per user
- **Reviews** — customer submission + admin moderation (approve/reject)
- **Email verification** — on signup with token-based verification flow
- **Password reset** — forgot/reset with time-limited tokens
- **Address book** — save and manage multiple shipping addresses
- **Search** — typeahead search bar in header, navigates to filtered product listing
- **MegaMenu** — hover-activated category dropdown in header
- **Banner management** — hero carousel, strip banners, category-top placements with image upload
- **Audit logging** — automatic logging of admin actions (order status changes, etc.)
- **Order tracking** — status history array, return requests
- **Responsive design** — mobile-first boutique-luxury aesthetic

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State | Redux Toolkit + RTK Query |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (short-lived access + httpOnly refresh tokens) |
| Validation | Zod (server-side request validation) |
| Payments | Razorpay |
| Image storage | Cloudinary |
| Rate limiting | express-rate-limit |

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (M0 free tier)
- Cloudinary account (free tier) — optional, falls back to local storage

### Setup

```bash
# Clone and install
git clone <repo-url> aurelia-jewels
cd aurelia-jewels

# Install all dependencies (server, client, and builds client)
npm install

# Set up environment
cp server/.env.example server/.env
# Edit server/.env with your credentials (see below)
```

Required `.env` values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Atlas connection string (see [Atlas setup](#mongodb-atlas)) |
| `JWT_SECRET` | Random 64-char string for access tokens |
| `JWT_REFRESH_SECRET` | Different random 64-char string for refresh tokens |
| `CLOUDINARY_*` | Cloudinary credentials (skip for local storage fallback) |

### Start development

```bash
npm run dev
```

This runs both the Express server (port from `.env`, default 5002) and Vite dev server (port 5173) concurrently. The Vite proxy forwards `/api` requests to the Express server.

## Deployment (Render)

This project is configured for one-command deployment on Render as a single Web Service:

1. Push your repo to GitHub
2. On Render: **New → Web Service → Connect your GitHub repo**
3. Use these settings:
   - **Build Command**: `npm install` (auto-runs `postinstall` → installs server + client deps, builds client)
   - **Start Command**: `npm start`
4. Add environment variables in Render dashboard (same keys as `.env`)
5. Set `NODE_ENV=production` and `CLIENT_URL=https://your-app.onrender.com`

The server serves the built React SPA at the same URL — no separate frontend hosting needed.

## Project Structure

```
aurelia-jewels/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Redux slices + RTK Query APIs
│   │   ├── hooks/       # Custom React hooks
│   │   └── pages/       # Route pages (incl. admin panel)
├── server/              # Express backend
│   ├── src/
│   │   ├── config/      # DB, Cloudinary config
│   │   ├── controllers/ # Route handlers
│   │   ├── middlewares/  # Auth, RBAC, validation, sanitization
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express route definitions
│   │   ├── services/    # Business logic (pricing, email, payments)
│   │   ├── utils/       # Seed scripts, logger, response helpers
│   │   └── validators/  # Zod schemas
├── docker/              # Docker Compose (local dev only)
├── docs/                # API and architecture docs
└── .github/             # CI/CD workflows
```

## Security

- **RBAC**: 6 roles, granular per-resource permissions
- **JWT**: 15-minute access tokens, 7-day httpOnly refresh tokens with `sameSite: strict`
- **Helmet**: security headers (CSP, XSS, etc.)
- **Input sanitization**: HTML stripping on all inputs, NoSQL injection prevention (`mongo-sanitize`)
- **Rate limiting**: 100 req/15min global, 20 req/15min on auth routes
- **CORS**: scoped to client URL
- **Validation**: Zod schemas on all mutation endpoints
- **File uploads**: MIME whitelist (JPEG/PNG/WebP/AVIF), 5MB limit, sanitized filenames

## API

Base URL: `/api/v1`

See [`API.md`](API.md) for full endpoint documentation and [`ARCHITECTURE.md`](ARCHITECTURE.md) for data flow diagrams.

## License

Private — All rights reserved.
