# E-Commerce Platform

This repository contains the complete source code for an E-Commerce platform, consisting of a Node.js/Prisma Backend, a Store Frontend, and an Admin Dashboard.

## Project Structure

- `backend/`: Node.js Express server with Prisma ORM.
- `frontend/admin-web/`: Admin dashboard built with Next.js/React.
- `frontend/store-web/`: Customer-facing storefront built with Next.js/React.
- `frontend/shared-ui/`: Shared UI components for the frontends.

## Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your database credentials.
4. Run database migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup (Admin Web)
1. Navigate to the admin-web directory:
   ```bash
   cd frontend/admin-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup (Store Web)
1. Navigate to the store-web directory:
   ```bash
   cd frontend/store-web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and configure as needed.
4. Start the development server:
   ```bash
   npm run dev
   ```
