# SoukPay Rewards

A full-stack loyalty rewards application built with a React Native (Expo) mobile client and a Node.js/Express backend. Users earn points, browse rewards, and redeem them — all with real-time balance tracking, offline awareness, and secure JWT authentication.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Mobile Setup](#mobile-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Mobile App Screens](#mobile-app-screens)
- [State Management](#state-management)
- [Key Design Decisions](#key-design-decisions)

---

## Architecture Overview

```
soukpay-rewards-assessment/
├── backend/          # Express + Prisma API server
├── mobile/           # Expo React Native app
└── docker-compose.yml
```

The backend exposes a REST API secured with JWT. The mobile app communicates with it via Axios, stores the auth token in `expo-secure-store`, and manages global state with Redux Toolkit.

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express v5 |
| ORM | Prisma v7 (driver adapter pattern) |
| Database | PostgreSQL 15 |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcryptjs |
| Idempotency | UUID v4 keys on redemptions |

### Mobile
| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK / React Native |
| Routing | expo-router v6 (file-based) |
| State | Redux Toolkit + createAsyncThunk |
| Auth storage | expo-secure-store |
| Networking | Axios |
| Fonts | Inter + Manrope (@expo-google-fonts) |
| Offline detection | @react-native-community/netinfo |
| Graphics | expo-blur, react-native-svg |

---

## Project Structure

### Backend — `backend/`

```
backend/
├── prisma/
│   └── schema.prisma        # Data models: User, PointLedger, Reward, Redemption
├── prisma.config.ts         # Prisma v7 config with datasource URL
├── src/
│   ├── index.ts             # Express app entry point
│   ├── seed.ts              # Database seeder (3 users, 4 rewards, ledger history)
│   ├── lib/
│   │   └── prisma.ts        # PrismaClient singleton with pg driver adapter
│   ├── middleware/
│   │   └── auth.middleware.ts  # JWT verification middleware
│   └── routes/
│       ├── auth.routes.ts   # POST /auth/login
│       ├── reward.routes.ts # GET /rewards, POST /rewards/:id/redeem
│       └── user.routes.ts   # GET /users/me, GET /users/me/transactions
```

### Mobile — `mobile/`

```
mobile/
├── app/
│   ├── _layout.tsx          # Root layout: fonts, splash, Redux Provider, offline banner
│   ├── (auth)/
│   │   └── login.tsx        # Login screen
│   └── (tabs)/
│       ├── _layout.tsx      # Bottom tab navigator
│       ├── index.tsx        # Home screen
│       ├── rewards.tsx      # Rewards screen
│       └── history.tsx      # Transaction history screen
├── components/
│   ├── AuthGate.tsx         # Declarative auth redirect guard
│   ├── Header.tsx           # Shared app header
│   ├── OfflineBanner.tsx    # Animated offline status banner
│   ├── home/
│   │   ├── AnimatedBalance.tsx
│   │   ├── TransactionRow.tsx
│   │   └── PromoCard.tsx
│   ├── history/
│   │   ├── PortfolioCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── UpdatingLedger.tsx
│   └── rewards/
│       ├── BalanceHeader.tsx
│       ├── CategoryTabs.tsx
│       ├── RewardCard.tsx
│       └── RedeemModal.tsx
├── store/
│   ├── index.ts
│   ├── hooks.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── userSlice.ts
│       ├── rewardsSlice.ts
│       └── transactionsSlice.ts
├── services/
│   └── api.ts               # Axios instance + all API calls
├── hooks/
│   └── useNetworkStatus.ts  # NetInfo hook → boolean isOnline
└── constants/
    └── fonts.ts             # Typed font family constants
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker + Docker Compose
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or Expo Go on a physical device)

---

### Backend Setup

**1. Start the database**

```bash
docker-compose up -d postgres
```

**2. Install dependencies**

```bash
cd backend
npm install
```

**3. Create `.env`**

```env
DATABASE_URL=postgresql://soukpay:soukpay123@localhost:5432/soukpay_rewards
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
PORT=3000
```

**4. Run migrations**

```bash
npx prisma migrate dev
```

**5. Seed the database**

```bash
npx ts-node src/seed.ts
```

This creates 3 users, 4 rewards, and a full ledger history for each user.

**6. Start the server**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

**Test credentials**

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |
| carol@example.com | password123 |

---

### Mobile Setup

**1. Install dependencies**

```bash
cd mobile
npm install
```

**2. Configure the API base URL**

The app is pre-configured for `localhost:3000` which works with iOS Simulator and Android Emulator.

**Physical device only:** Update `BASE_URL` in `mobile/services/api.ts`:
```typescript
const BASE_URL = 'http://192.168.x.x:3000'; // your machine's local IP
```

**3. Start the app**

```bash
npx expo start
```

Press `i` for iOS Simulator or `a` for Android Emulator.

---

### Run Everything with Docker

To run both the database and backend together:

```bash
docker-compose up --build
```

The backend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://soukpay:soukpay123@localhost:5432/soukpay_rewards` |
| `JWT_SECRET` | Secret key for signing tokens | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `PORT` | Server port | `3000` |

---

## API Reference

All routes except `/auth/login` require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login with email + password. Returns `{ token, user }` |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/me` | Returns profile + computed point balance |
| `GET` | `/users/me/transactions` | Paginated ledger history (`?page=1&limit=20`) |

### Rewards

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rewards` | Returns all active rewards with stock > 0 |
| `POST` | `/rewards/:id/redeem` | Redeem a reward. Requires `X-Idempotency-Key` header |

**Redemption flow** (atomic transaction):
1. Verify reward exists and is active
2. Check stock > 0
3. Aggregate user's point balance
4. Verify sufficient points
5. Decrement stock
6. Append negative ledger entry
7. Create redemption record

Duplicate requests with the same `X-Idempotency-Key` return the original response safely.

---

## Mobile App Screens

### Login
Email/password form. Token and expiry (7 days) stored in `expo-secure-store`. On app launch, `loadStoredAuth` checks for a valid, non-expired token and restores the session automatically.

### Home
- Animated points balance counter
- Recent transactions list
- Promo card

### Rewards
- Available balance header with tier badge
- Category filter tabs (All, Food & Drink, Entertainment, Shopping, Membership)
- Reward cards with images and blur lock overlay for unaffordable items
- Offline-aware: cards and redeem button are disabled with `"YOU ARE OFFLINE"` / `"Offline"` labels when there is no internet connection
- Bottom sheet confirmation modal with idempotency-safe redeem action

### History
- Portfolio balance card
- Search/filter bar
- Paginated transaction list with infinite scroll
- Pull-to-refresh with custom animated indicator (native spinner hidden)
- Milestone cards injected into the list

---

## State Management

Four Redux slices manage all global state:

| Slice | Responsibility |
|-------|---------------|
| `authSlice` | Token, user identity, login/logout, session restore |
| `userSlice` | Profile, balance, recent transactions |
| `rewardsSlice` | Rewards list, redeem action, optimistic stock/balance updates |
| `transactionsSlice` | Paginated ledger, pagination state, refresh |

**Optimistic updates on redemption:** balance and stock are decremented immediately in the UI. If the API call fails, the balance is restored and rewards are re-fetched.

---

## Key Design Decisions

**Prisma v7 driver adapter** — Prisma v7 removed the `url` field from `schema.prisma`. The client is initialised with `PrismaPg` from `@prisma/adapter-pg`, and the connection string is passed through `prisma.config.ts`.

**Declarative auth gate** — Navigation is handled with `<Redirect>` from expo-router rather than imperative `router.push()` calls, avoiding the "navigate before mounting" race condition.

**Idempotency keys** — Every redemption request generates a UUID v4 key sent as `X-Idempotency-Key`. The backend deduplicates on this key, making retries safe.

**Token expiry check on device** — The expiry timestamp is stored alongside the token in `expo-secure-store`. Expired tokens are cleared on app launch without making a network request.

**Offline banner + disabled actions** — `useNetworkStatus` (backed by `@react-native-community/netinfo`) provides a boolean `isOnline` flag used at the root layout level (animated banner) and at the component level (disabled redeem buttons with contextual labels).

## What I Would Add With More Time

### Features
- **Push notifications** — on successful redemption, trigger an Expo push notification via the backend confirming the reward
- **Token refresh flow** — silent token renewal before expiry using a refresh token, so users are never unexpectedly logged out
- **Redemption history screen** — dedicated screen showing past redemptions with reward details
- **Leaderboard** — `GET /leaderboard` endpoint returning top 10 users by lifetime points earned
- **Loading skeletons** — replace activity indicators with placeholder skeleton UI while data loads

### Code Quality
- **Jest unit tests** — test the redemption service for: successful redemption, insufficient points rejection, and duplicate idempotency key handling
- **Input sanitization** — add express-validator middleware on all POST routes
- **Rate limiting** — add express-rate-limit on the login endpoint to prevent brute force attacks
- **Error boundary** — global React error boundary in the mobile app to catch unexpected crashes gracefully

### Infrastructure
- **CI/CD pipeline** — GitHub Actions to run tests and type checks on every pull request
- **Environment-based config** — separate `.env.staging` and `.env.production` with different JWT secrets and DB URLs