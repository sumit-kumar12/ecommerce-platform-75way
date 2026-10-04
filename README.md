# 🛍️ Katabazaar — Full-Stack E-Commerce Platform

> A production-grade, security-first e-commerce platform built with Node.js, Next.js, PostgreSQL, Redis, and Meilisearch.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://prisma.io)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Security](#security)
- [Database Schema](#database-schema)

---

## Overview

Katabazaar is a complete, full-stack e-commerce platform comprising:

| Component | Description | Port |
|---|---|---|
| **Backend API** | Express.js REST API with JWT auth, Prisma ORM | `4000` |
| **Store Web** | Customer-facing Next.js storefront | `3000` |
| **Admin Web** | Merchant/Platform admin dashboard | `3001` |

**Project Scale:**
- 🗂️ **67** frontend pages
- 🔌 **29** API route modules
- 🗃️ **66** Prisma database models
- 🔐 Multi-layer security middleware stack

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  ┌─────────────────────┐    ┌────────────────────────────────┐  │
│  │   Store Web :3000   │    │      Admin Web :3001           │  │
│  │   (Next.js 15)      │    │      (Next.js 15)              │  │
│  │                     │    │                                │  │
│  │ • Product Catalog   │    │ • Product Management           │  │
│  │ • Cart & Checkout   │    │ • Order Management             │  │
│  │ • User Account      │    │ • Analytics Dashboard          │  │
│  │ • Order Tracking    │    │ • Security Operations          │  │
│  │ • Reviews & Q&A     │    │ • SOC / Threat Intel           │  │
│  └─────────┬───────────┘    └──────────────┬─────────────────┘  │
│            │                               │                    │
└────────────┼───────────────────────────────┼────────────────────┘
             │   HTTP/REST + Cookie Auth      │
             ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API :4000                           │
│                                                                 │
│  ┌──────────────┐ ┌─────────────┐ ┌───────────────────────┐   │
│  │  Auth Layer  │ │  API Router │ │  Security Middleware   │   │
│  │              │ │             │ │                       │   │
│  │ JWT Access   │ │ /auth       │ │ CSRF Protection       │   │
│  │ JWT Refresh  │ │ /products   │ │ Rate Limiting         │   │
│  │ OAuth Google │ │ /cart       │ │ Helmet Headers        │   │
│  │ Remember Me  │ │ /orders     │ │ Input Sanitization    │   │
│  │ Email Verify │ │ /payments   │ │ Threat Score Engine   │   │
│  └──────────────┘ │ /reviews    │ │ IP Blocking           │   │
│                   │ /wishlist   │ │ Lockout Guard         │   │
│                   │ /contact    │ └───────────────────────┘   │
│                   │ /admin      │                              │
│                   │ /returns    │                              │
│                   │ /shipping   │                              │
│                   │ /pos        │                              │
│                   └─────────────┘                              │
└───────────┬──────────────────┬────────────────────┬───────────┘
            │                  │                    │
            ▼                  ▼                    ▼
┌──────────────────┐ ┌───────────────┐ ┌──────────────────────┐
│   PostgreSQL 16  │ │   Redis 7     │ │   Meilisearch        │
│                  │ │               │ │                      │
│ • 66 ORM Models  │ │ • Sessions    │ │ • Product Search     │
│ • Prisma ORM     │ │ • Email Verify│ │ • Full-text Index    │
│ • Migrations     │ │ • Rate Limits │ │ • Faceted Filtering  │
│ • Relationships  │ │ • CSRF Tokens │ │                      │
└──────────────────┘ └───────────────┘ └──────────────────────┘
```

### Request Lifecycle

```
Client Request
      │
      ▼
  [Helmet]          — Security headers (CSP, HSTS, X-Frame)
      │
  [CORS]            — Strict origin whitelist
      │
  [Body Parser]     — JSON + size limit (10kb)
      │
  [Request ID]      — Unique trace ID per request
      │
  [Rate Limiter]    — Redis-backed sliding window
      │
  [CSRF Check]      — Double-submit cookie pattern
      │
  [JWT Verify]      — Access token from HttpOnly cookie
      │
  [Account Active]  — isActive + lockout check
      │
  [Threat Score]    — Behavioural threat analysis
      │
  [Route Handler]   — Business logic
      │
  [Error Handler]   — Structured error responses
      │
      ▼
  Client Response
```

### Authentication Flow

```
┌────────┐          ┌─────────────┐        ┌──────────┐  ┌───────┐
│ Client │          │  Backend    │        │   DB     │  │ Redis │
└────────┘          └─────────────┘        └──────────┘  └───────┘
    │                     │                     │              │
    │── POST /auth/register ──►                 │              │
    │                     │── createUser ──────►│              │
    │                     │◄── user created ────│              │
    │                     │── storeVerifyToken ─────────────►  │
    │◄── 201 (check email) ──                  │              │
    │                                           │              │
    │── GET /verify-email?token=xyz ──►         │              │
    │                     │── redis.get(token)───────────────► │
    │                     │── update isEmailVerified=true ──►  │
    │◄── redirect /login?verified=1 ──          │              │
    │                                           │              │
    │── POST /auth/login ──►                    │              │
    │                     │── findUser ─────────►│              │
    │                     │── isEmailVerified?  │              │
    │                     │── bcrypt.compare    │              │
    │                     │── issueRefreshToken►│              │
    │◄── Set-Cookie: access_token + refresh_token              │
```

---

## Features

### Store (Customer-Facing)

| Feature | Status | Details |
|---|---|---|
| Product Catalog | ✅ | Category tree, search, filters |
| Product Detail | ✅ | Gallery, variants, dynamic reviews, Write a Review button |
| Cart | ✅ | Persistent, guest-to-user merge on login |
| Wishlist | ✅ | Add/remove, add-all-to-cart |
| Checkout | ✅ | Address management, shipping calc |
| Payment | ✅ | Razorpay integration with webhook verification |
| Order History | ✅ | Paginated list with status badges |
| Order Tracking | ✅ | Real-time status steps with real dates from DB |
| Returns | ✅ | Return request flow |
| Security Page | ✅ | Active sessions list, individual session revoke |
| Email Verification | ✅ | Token via Redis, blocks login until verified |
| Remember Me | ✅ | Session vs 30-day persistent cookie |
| Google OAuth | ✅ | Social login |
| Reviews & Ratings | ✅ | Dynamic average score, inline submit form |
| Q&A | ✅ | Product questions and answers |
| Notifications | ✅ | In-app notification bell |
| Contact Support | ✅ | Real API submission saved to server log |
| Flash Deals | ✅ | Time-limited offer banners |
| Recently Viewed | ✅ | localStorage-persisted history |

### Admin Dashboard

| Feature | Status |
|---|---|
| Product CRUD | ✅ |
| Category Management | ✅ |
| Order Management | ✅ |
| User Management | ✅ |
| Analytics Dashboard | ✅ |
| Campaign / Hero Banner | ✅ |
| Sponsored Ads | ✅ |
| Outlet / POS | ✅ |
| SOC (Security Operations Center) | ✅ |
| Threat Intelligence | ✅ |
| IP Block Management | ✅ |
| Global Emergency Lockout | ✅ |
| Returns & Refund Management | ✅ |
| Inventory Snapshots | ✅ |

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Node.js v20+** | JavaScript runtime |
| **Express.js** | HTTP framework |
| **Prisma ORM** | Type-safe database access |
| **PostgreSQL 16** | Primary relational database |
| **Redis 7** | Sessions, rate limiting, email tokens |
| **Meilisearch** | Full-text product search |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing (12 rounds) |
| **Zod** | Runtime schema + input validation |
| **Razorpay** | Payment gateway SDK |
| **Winston** | Structured JSON logging |
| **Nodemailer** | Transactional email |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | API rate limiting |
| **sanitize-html** | XSS input sanitization |
| **ws** | WebSocket (live threat feed) |
| **node-cron** | Scheduled background jobs |

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework (App Router) |
| **React 19** | UI library |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Material Symbols** | Google icon font |

---

## Project Structure

```
katabazaar/
├── README.md
├── .gitignore
│
├── backend/                        # Node.js Express API
│   ├── prisma/
│   │   ├── schema.prisma           # 66 database models
│   │   └── migrations/             # DB migration history
│   ├── src/
│   │   ├── server.js               # Entry point (port 4000)
│   │   ├── app.js                  # Express app bootstrap
│   │   ├── config/
│   │   │   ├── env.js              # Zod-validated env config
│   │   │   ├── prisma.js           # Prisma client singleton
│   │   │   ├── redis.js            # Redis client
│   │   │   └── logger.js           # Winston structured logger
│   │   ├── controllers/            # Route handler functions
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── order.controller.js
│   │   │   └── ...
│   │   ├── services/               # Business logic layer
│   │   │   ├── auth.service.js     # Login, register, verify, OAuth
│   │   │   ├── token.service.js    # JWT issue/verify/rotate
│   │   │   ├── product.service.js
│   │   │   ├── cart.service.js
│   │   │   ├── order.service.js
│   │   │   └── threat.service.js
│   │   ├── middlewares/
│   │   │   ├── csrf.middleware.js
│   │   │   ├── jwt.middleware.js
│   │   │   ├── rate-limit.middleware.js
│   │   │   ├── lockout.middleware.js
│   │   │   └── threat-score.middleware.js
│   │   ├── routes/                 # 29 API route files
│   │   │   ├── index.js            # Route aggregator
│   │   │   ├── auth.routes.js      # /auth/*
│   │   │   ├── product.routes.js   # /products/*
│   │   │   ├── order.routes.js     # /orders/*
│   │   │   ├── payment.routes.js   # /payments/*
│   │   │   ├── cart.routes.js      # /cart/*
│   │   │   ├── wishlist.routes.js  # /wishlist/*
│   │   │   ├── contact.routes.js   # /contact
│   │   │   ├── user.routes.js      # /users/*
│   │   │   ├── review.routes.js    # /reviews/*
│   │   │   ├── admin.routes.js     # /admin/* (role-protected)
│   │   │   ├── returns.routes.js   # /returns/*
│   │   │   ├── shipping.routes.js  # /shipping/*
│   │   │   ├── pos.routes.js       # /pos/*
│   │   │   └── ...
│   │   └── utils/
│   │       ├── cookies.js          # Cookie helpers (rememberMe)
│   │       ├── crypto.js           # Secure token generation
│   │       └── sanitize.js         # Text sanitization helpers
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── shared-ui/                  # Shared component library
    │
    ├── store-web/                  # Customer storefront
    │   ├── app/
    │   │   ├── layout.jsx
    │   │   ├── page.jsx            # Homepage
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── verify-email/       # Email verification landing
    │   │   ├── forgot-password/
    │   │   ├── reset-password/
    │   │   ├── product/[id]/       # Product detail
    │   │   ├── products/           # Catalog / search
    │   │   ├── cart/
    │   │   ├── checkout/
    │   │   ├── wishlist/
    │   │   ├── order/              # Track order entry
    │   │   ├── account/
    │   │   │   ├── orders/[id]/tracking/
    │   │   │   ├── security/       # Sessions + revocation
    │   │   │   └── ...
    │   │   └── help/contact/       # Contact form
    │   ├── components/
    │   │   ├── layout/             # Header, footer, shell
    │   │   ├── catalog/            # ProductCard, filters
    │   │   ├── product/            # StickyBuyBar, OfferBox
    │   │   └── ui/                 # Buttons, panels, toasts
    │   ├── lib/
    │   │   ├── api.js              # Fetch wrapper + CSRF auto-attach
    │   │   └── catalog.js          # Price + image utilities
    │   ├── public/
    │   │   ├── images/
    │   │   ├── logo.png
    │   │   └── icon.svg
    │   └── .env.example
    │
    └── admin-web/                  # Admin dashboard
        ├── app/
        └── components/
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | v20+ |
| PostgreSQL | v16+ |
| Redis | v7+ |
| Meilisearch | v1.x |

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB, Redis, and secret values

npx prisma generate
npx prisma migrate deploy
npm run seed      # (optional) load sample data
npm run dev       # starts on port 4000
```

### 2. Store Frontend

```bash
cd frontend/store-web
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
npm run dev       # starts on port 3000
```

### 3. Admin Frontend

```bash
cd frontend/admin-web
npm install
npm run dev       # starts on port 3001
```

---

## Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/katabazaar"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets
JWT_ACCESS_SECRET=<64-byte-hex>
JWT_REFRESH_SECRET=<64-byte-hex>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# Cookies
COOKIE_SECRET=<64-byte-hex>
ACCESS_COOKIE_NAME=kb_access
REFRESH_COOKIE_NAME=kb_refresh
CSRF_COOKIE_NAME=kb_csrf

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# Meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=your_master_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# App
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
```

### Store Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/auth/csrf-token` | Get CSRF token | No |
| `POST` | `/api/v1/auth/register` | Register new account | No |
| `POST` | `/api/v1/auth/verify-email` | Verify email token | No |
| `POST` | `/api/v1/auth/login` | Login | No |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | No |
| `POST` | `/api/v1/auth/logout` | Logout | Yes |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset | No |
| `POST` | `/api/v1/auth/reset-password` | Set new password | No |
| `GET` | `/api/v1/auth/google` | Google OAuth | No |

### Store

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products` | List/search products |
| `GET` | `/api/v1/products/:id` | Product detail |
| `GET` | `/api/v1/products/:id/related` | Related products |
| `GET` | `/api/v1/products/categories/tree` | Category tree |
| `GET/POST/PATCH/DELETE` | `/api/v1/cart/*` | Cart management |
| `GET/POST/DELETE` | `/api/v1/wishlist/*` | Wishlist management |
| `GET` | `/api/v1/orders` | Order history |
| `GET` | `/api/v1/orders/:id` | Order detail + tracking |
| `POST` | `/api/v1/payments/create-order` | Razorpay order |
| `POST` | `/api/v1/payments/verify` | Verify payment |
| `GET/POST` | `/api/v1/products/:id/reviews` | Product reviews |
| `POST` | `/api/v1/contact` | Contact form submission |
| `GET` | `/api/v1/users/me` | Current user profile |
| `GET` | `/api/v1/users/me/sessions` | Active sessions |
| `DELETE` | `/api/v1/users/me/sessions/:id` | Revoke session |

---

## Security

### Security Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Security Layers                    │
│                                                      │
│  Layer 1: Transport                                  │
│    • HTTPS in production                             │
│    • HSTS header enforcement                         │
│    • Strict CORS origin whitelist                    │
│                                                      │
│  Layer 2: Request Validation                         │
│    • CSRF double-submit cookie                       │
│    • Zod schema validation on all inputs             │
│    • sanitize-html on all text fields                │
│    • 10kb body size limit                            │
│                                                      │
│  Layer 3: Authentication                             │
│    • 15-min JWT access tokens (HttpOnly cookie)      │
│    • 30-day rotating refresh tokens                  │
│    • Email verification before first login           │
│    • Remember Me (session vs persistent cookie)      │
│    • bcrypt (12 rounds) password hashing             │
│                                                      │
│  Layer 4: Threat Intelligence                        │
│    • Per-IP behavioural threat scoring               │
│    • Automatic account lockout on brute force        │
│    • Admin-managed IP block list                     │
│    • Redis-backed rate limiting per IP + email       │
│    • Global lockout mode for emergencies             │
│                                                      │
│  Layer 5: Session Management                         │
│    • Active session listing per user                 │
│    • Individual session revocation                   │
│    • Refresh token family rotation                   │
│    • Access token revocation list in Redis           │
└──────────────────────────────────────────────────────┘
```

### Key Security Decisions

1. **HttpOnly cookies** — Tokens stored in HttpOnly cookies, never accessible to JavaScript — prevents XSS token theft.

2. **CSRF double-submit** — Every mutating request requires a matching CSRF token in both cookie and header. Tokens rotate per session.

3. **Refresh token rotation** — Each token refresh creates a new pair and invalidates the old. Reuse triggers family-wide revocation.

4. **Email verification** — New accounts cannot log in until verified via a 24-hour Redis-stored token.

5. **Threat score engine** — Behavioural scoring per IP with progressive penalties: slow-down → CAPTCHA → lockout → block.

---

## Database Schema

**66 Prisma models** spanning the full platform:

```
Core:          User, Address, RefreshToken, PasswordResetToken
Catalog:       Category, Product, ProductVariant, ProductImage
Commerce:      Cart, CartItem, Wishlist, WishlistItem
Orders:        Order, OrderItem, Payment
Reviews:       Review, ProductQA, ProductQAAnswer
Marketing:     Offer, OfferRedemption, HeroCampaign, FlashDeal
               SponsoredAd
Logistics:     ShippingConfig, ShippingSettings, Outlet
               OutletInventory
Returns:       ReturnRequest, ReturnItem
Notifications: UserNotification, NotificationEvent
               NotificationPreference
Security:      ThreatScore, ThreatEvent, ThreatRule, IPBlock
               AuthAttemptCounter, AccessTokenRevocation
               SessionBinding, AuditLog, GlobalPaymentPolicy
               Incident, HoneypotTrap, RolePolicy
               EmergencyConfig, EmergencyAlert
SOC:           SocCase, SocCaseTimeline, SocCaseEvidence
               SocCaseIoc, SocCaseNote, SocCaseAudit
               SocCaseAsset, SocPlaybook, SocPlaybookRun
               SocResponseAction, SocLog, SiemConfig
Analytics:     PageView, KeywordRule, InventorySnapshot
POS:           DrawerShift
```

---

## Development Scripts

### Backend

```bash
npm run dev              # Start with auto-restart (node --watch)
npm run seed             # Seed sample products and users
npm run admin:reset      # Reset admin account passwords
npx prisma studio        # Open DB GUI at localhost:5555
npx prisma migrate dev   # Create new migration
```

### Frontend

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # ESLint check
```

---

*Built with Node.js, Next.js, PostgreSQL, Redis, and Meilisearch*
