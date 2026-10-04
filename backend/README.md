# Secure Single-Store E-commerce Backend

Production-grade backend built with:

- Node.js LTS
- Express
- Prisma ORM
- PostgreSQL
- Winston structured logging
- Zod request validation
- JWT access + rotating refresh token auth
- Hardened Nginx reverse proxy config

## Folder structure

```text
backend/
  prisma/
    schema.prisma
  src/
    app.js
    server.js
    config/
      constants.js
      env.js
      logger.js
      prisma.js
      request-context.js
    controllers/
      admin.controller.js
      auth.controller.js
      cart.controller.js
      order.controller.js
      payment.controller.js
      product.controller.js
      wishlist.controller.js
    errors/
      app-error.js
    middlewares/
      account-active.middleware.js
      admin-guard.middleware.js
      csrf.middleware.js
      error-handler.middleware.js
      jwt.middleware.js
      ownership.middleware.js
      rate-limit.middleware.js
      request-context.middleware.js
      request-id.middleware.js
      request-logger.middleware.js
      role.middleware.js
      suspicious-input.middleware.js
      threat-score.middleware.js
    routes/
      admin.routes.js
      auth.routes.js
      cart.routes.js
      index.js
      order.routes.js
      payment.routes.js
      product.routes.js
      wishlist.routes.js
    services/
      audit.service.js
      auth.service.js
      cart.service.js
      notification.service.js
      order.service.js
      payment.service.js
      product.service.js
      threat.service.js
      token.service.js
      wishlist.service.js
    utils/
      async-handler.js
      cookies.js
      crypto.js
      money.js
      sanitize.js
      security-patterns.js
      security-stack.js
  nginx/
    nginx.conf
  postgres/
    pg_hba.conf
    postgresql.conf
    security-roles.md
  ops/
    server-hardening.md
```

## Security middleware order

Global middleware stack in `src/app.js` is enforced in strict order:

1. disable `x-powered-by`
2. Helmet (with CSP + HSTS)
3. strict CORS allowlist
4. body size limit 1MB
5. request ID
6. structured request logging
7. suspicious input scanner (SQLi/XSS/recon patterns)
8. global rate limiter
9. CSRF protection
10. JWT verification
11. account active check
12. threat score/IP block check
13. role middleware (route-level)
14. ownership middleware (route-level)
15. route handler
16. central error handler

If the global security chain is missing or out of order, startup fails.

## Required environment variables

The application validates all required environment variables at startup in `src/config/env.js` and exits on failure.

Required keys:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `COOKIE_SECURE` (optional; defaults `true` in production)
- `COOKIE_ENCRYPTION_KEY` (base64 32 bytes)
- `CORS_ALLOWED_ORIGINS`
- `APP_BASE_DOMAIN`
- `ADMIN_SUBDOMAIN`
- `ADMIN_ROUTE_PREFIX`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `HONEYPOT_PATH`

## Auth and token security

- register/login/logout/refresh implemented
- access token + rotating refresh token family implemented
- refresh tokens are hashed in DB and device-bound (`x-device-id`)
- refresh token reuse detection revokes full token family
- account lockout after 5 failed login attempts
- threat score increment on failed auth behavior

## Payment security

- Razorpay integration verifies HMAC signature server-side
- backend recalculates expected order amount from DB order items
- mismatched amount is rejected and logged
- mismatches increase threat score and can trigger account/IP lock
- signature verification handles malformed signatures safely
- payment verification + order paid transition are committed atomically

## Notifications

- SendGrid email + Twilio WhatsApp integrations
- notifications sent to admin, lister, and customer on order/payment events
- per-recipient per-channel per-event hourly rate limiting
- all notification attempts logged and persisted

## Database safety

- Prisma ORM only (no raw SQL in application code)
- suspicious query argument pattern detector in Prisma middleware
- slow query logs: warn >200ms, critical >1000ms
- ownership checks on protected resources
- stock decrement uses guarded updates to prevent overselling during concurrent order creation

## Nginx and PostgreSQL hardening

- Nginx hardened reverse proxy: `nginx/nginx.conf`
- PostgreSQL binding and timeout hardening: `postgres/postgresql.conf`
- PostgreSQL host-based access controls: `postgres/pg_hba.conf`
- least-privilege and public schema lock-down procedure: `postgres/security-roles.md`
- OS/security baseline: `ops/server-hardening.md`
