# Aurelia Jewels

Full-stack jewelry e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js).

> **Tagline:** *"Wear the Warmth of Gold."*

## Features

- **Dynamic product catalog** — admin-controlled CRUD for products, categories, pricing
- **RBAC (Role-Based Access Control)** — 6 default roles with granular permissions
- **Live gold-rate pricing** — prices computed server-side from configurable daily rates
- **Full admin dashboard** — manage products, orders, users, roles, coupons, banners, gold rates
- **Cart & checkout** — guest cart merging, Razorpay + COD payment
- **Responsive design** — modern boutique-luxury aesthetic, mobile-first

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| State | Redux Toolkit + RTK Query |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Payments | Razorpay |
| Storage | Cloudinary |
| Caching | Redis |
| Containers | Docker + docker-compose |

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Redis (optional, for rate limiting)

### Setup

```bash
# Clone and install
git clone <repo-url> aurelia-jewels
cd aurelia-jewels

# Install dependencies
npm install
npm install --prefix server
npm install --prefix client

# Set up environment
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Seed default roles and start
npm run dev
```

### Docker

```bash
docker-compose -f docker/docker-compose.dev.yml up
```

### Environment Variables

See `server/.env.example` for all required variables.

## Project Structure

```
aurelia-jewels/
├── client/          # React frontend (Vite)
├── server/          # Express backend
├── docker/          # Docker config
├── .github/         # CI/CD
└── docs/            # API docs
```

## API

Base URL: `/api/v1`

See `docs/API.md` for full endpoint documentation.

## License

Private — All rights reserved.
