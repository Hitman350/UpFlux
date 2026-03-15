<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white" />
  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
</p>

<h1 align="center">⚡ UpFlux</h1>
<p align="center">
  <strong>Decentralized Website Uptime Monitoring — Powered by Solana Validators</strong>
</p>
<p align="center">
  A distributed, trustless uptime monitoring platform where independent validator nodes verify website availability via WebSocket-based callback communication, with cryptographic proof-of-work using Solana Ed25519 signatures.
</p>

---

## 📌 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Callback-Based Communication](#callback-based-communication)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Overview

**UpFlux** is a full-stack, decentralized uptime monitoring platform built as a **Turborepo monorepo**. Unlike traditional centralized monitoring services (e.g., UptimeRobot, Pingdom), UpFlux distributes validation work across a network of independent **validator nodes** that cryptographically sign their responses using **Solana keypairs** — ensuring tamper-proof, verifiable uptime data.

### Key Highlights

| Feature | Description |
|---|---|
| **Decentralized Validation** | Independent validator nodes perform HTTP health checks and sign results with Ed25519 keypairs |
| **Callback-Based Architecture** | Hub ↔ Validator communication uses a callback ID pattern over WebSockets for request/response correlation |
| **Cryptographic Integrity** | Every validation result is signed with `tweetnacl` and verified on the Hub using the validator's Solana public key |
| **Payout Tracking** | Validators earn `COST_PER_VALIDATION` (lamports) per successful validated tick, tracked in the database |
| **Real-Time Dashboard** | Next.js 16 frontend with Clerk authentication, live uptime tick visualization, and website CRUD |
| **Modern Monorepo** | Turborepo with shared packages for types, database client, UI components, and config |

---

## System Architecture

The platform consists of four main services and shared internal packages:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        UpFlux Platform                              │
│                                                                     │
│   ┌───────────┐     WebSocket (8081)      ┌───────────────────┐     │
│   │           │◄─────────────────────────►│                   │     │
│   │    HUB    │   Callback-based msgs     │    VALIDATOR(s)   │     │
│   │  Server   │   + Ed25519 signatures    │    (Distributed)  │     │
│   │           │                           │                   │     │
│   └─────┬─────┘                           └───────────────────┘     │
│         │                                                           │
│         │ Prisma ORM                                                │
│         ▼                                                           │
│   ┌───────────┐         REST (8080)       ┌───────────────────┐     │
│   │           │◄─────────────────────────►│                   │     │
│   │ PostgreSQL│                           │    API Server     │     │
│   │    (DB)   │◄──────── Prisma ─────────│   (Express.js)    │      │
│   │           │                           │                   │     │
│   └───────────┘                           └────────┬──────────┘     │
│                                                    │                │
│                                           Clerk JWT│(RS256)         │
│                                                    ▼                │
│                                           ┌───────────────────┐     │
│                                           │                   │     │
│                                           │    Frontend       │     │
│                                           │   (Next.js 16)    │     │
│                                           │                   │     │
│                                           └───────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Service | Port | Role |
|---|---|---|
| **Hub** | `8081` | Central WebSocket server that orchestrates validation. Maintains a pool of connected validators, dispatches URL check requests every 60s (skipping disabled **and paused** websites), verifies Ed25519 signatures, and records uptime ticks in the database. |
| **Validator** | — | Stateless WebSocket client that connects to the Hub, receives URL validation tasks, performs HTTP health checks, measures latency, and returns cryptographically signed results. |
| **API** | `8080` | Express.js REST API. Provides CRUD operations for websites (including pause/resume) behind Clerk JWT (RS256) authentication. Serves the frontend dashboard. |
| **Frontend** | `3000` | Next.js 16 app with Tailwind CSS 4. Features a landing page, authenticated dashboard with real-time uptime ticks, website management (add/delete/pause), and Clerk-powered auth (Sign In / Sign Up / User management). |

---

## Callback-Based Communication

The Hub and Validator communicate over WebSockets using a **callback ID pattern** — a lightweight alternative to request-response protocols that enables asynchronous, correlated message passing.

### How It Works

```
┌──────────────┐                               ┌──────────────┐
│              │  1. signup { callbackId,      │              │
│              │     publicKey, signedMsg }    │              │
│              │─────────────────────────────► │              │
│              │                               │              │
│              │  2. signup { validatorId,     │              │
│     HUB      │     callbackId }              │  VALIDATOR   │
│              │◄───────────────────────────── │              │
│              │                               │              │
│              │  3. validate { url,           │              │
│              │     callbackId }              │              │
│              │─────────────────────────────► │              │
│              │                 (HTTP GET url)│              │
│              │  4. validate { status,        │              │
│              │     latency, signedMsg,       │              │
│              │     callbackId }              │              │
│              │◄───────────────────────────── │              │
└──────────────┘                               └──────────────┘
```

**Step-by-step flow:**

1. **Validator Sign-Up** — On connection, the validator generates a `callbackId`, signs a message with its Solana keypair, and sends a `signup` event to the Hub.
2. **Hub Verification** — The Hub verifies the Ed25519 signature using `tweetnacl`, registers (or looks up) the validator in PostgreSQL, and responds with the assigned `validatorId` correlated via the same `callbackId`.
3. **Validation Request** — Every 60 seconds, the Hub iterates over all active (non-disabled) websites and sends a `validate` event to each connected validator with a unique `callbackId`.
4. **Validation Response** — The validator performs an HTTP `GET` request to the target URL, measures latency, determines status (`Good` / `Bad`), signs the response, and sends it back with the matching `callbackId`.
5. **Recording** — The Hub verifies the signature, records a `WebsiteTick` in the database, and increments the validator's `pendingPayouts`.

### Why Callbacks?

The callback pattern solves a fundamental challenge with WebSocket communication — **correlating responses to requests** in a bidirectional, asynchronous channel where multiple requests may be in-flight simultaneously. Each `callbackId` acts as a unique correlation token stored in an in-memory `CALLBACKS` map.

```typescript
// Hub: Register a callback before sending
const callbackId = randomUUID();
CALLBACKS[callbackId] = async (data) => { /* handle response */ };
ws.send(JSON.stringify({ type: 'validate', data: { url, callbackId } }));

// Hub: Resolve the callback when response arrives
CALLBACKS[data.callbackId](data);
delete CALLBACKS[data.callbackId];
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 | Server-side rendered UI with modern styling |
| **Authentication** | Clerk (NextJS SDK + JWKS) | OAuth/social login, session management, JWT-based API auth |
| **API Server** | Express.js 4 | RESTful backend with middleware-based JWT verification |
| **Hub Server** | Node.js + `ws` library | WebSocket server for validator orchestration |
| **Validator Nodes** | Node.js + `ws` library | Distributed health-check agents |
| **Cryptography** | `tweetnacl`, `@solana/web3.js` | Ed25519 signature creation and verification |
| **Database** | PostgreSQL 16 | Persistent storage for users, websites, validators, ticks |
| **ORM** | Prisma 7 (with generated client) | Type-safe database access layer |
| **Build System** | Turborepo | Monorepo task orchestration with caching |
| **Containerization** | Docker Compose | PostgreSQL service provisioning |
| **Language** | TypeScript 5.9 | End-to-end type safety across all packages |

---

## Monorepo Structure

```
upflux/
├── apps/
│   ├── hub/              # WebSocket hub server (port 8081)
│   │   └── index.ts      # Validator management, signature verification, tick recording
│   ├── validator/         # Validator node client
│   │   └── index.ts      # WebSocket client, HTTP validation, signature signing
│   ├── api/              # Express REST API (port 8080)
│   │   ├── index.ts      # Route definitions (website CRUD)
│   │   ├── middleware.ts  # Clerk JWKS-based JWT auth middleware
│   │   └── config.ts     # JWT public key configuration
│   └── frontend/         # Next.js 16 web application (port 3000)
│       ├── app/
│       │   ├── page.tsx       # Landing page (hero, features, pricing)
│       │   └── dashboard/
│       │       └── page.tsx   # Authenticated monitoring dashboard
│       ├── components/
│       │   ├── Appbar.tsx          # Navigation with Clerk auth buttons
│       │   ├── DashboardStats.tsx  # Aggregate stats (total sites, avg uptime, etc.)
│       │   ├── UptimeChart.tsx     # Uptime tick visualization bars
│       │   ├── WebsiteCard.tsx     # Individual website status card
│       │   ├── AddWebsiteModal.tsx # Modal for adding new monitored URLs
│       │   ├── EmptyState.tsx      # Empty dashboard placeholder
│       │   └── StatusIndicator.tsx # Animated status dot component
│       ├── hooks/
│       │   └── useWebsites.tsx  # Data fetching hook for dashboard
│       └── middleware.ts       # Clerk route protection
├── packages/
│   ├── common/           # Shared TypeScript interfaces & message types
│   │   └── index.ts      # IncomingMessage, OutgoingMessage, Signup/Validate types
│   ├── db/               # Prisma database package
│   │   ├── prisma/
│   │   │   └── schema.prisma  # User, Website, Validator, WebsiteTick models
│   │   └── src/
│   │       └── index.ts       # PrismaClient singleton export
│   ├── ui/               # Shared React component library
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared tsconfig presets
├── docker-compose.yml    # PostgreSQL 16 service
├── turbo.json            # Turborepo pipeline configuration
└── package.json          # Root workspace configuration
```

---

## Database Schema

The application uses **Prisma ORM** with PostgreSQL. Below is the entity-relationship model:

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    User      │       │    Website       │       │  Validator   │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id     (PK)  │       │ id       (PK)    │       │ id     (PK)  │
│ email  (UQ)  │       │ url              │       │ publicKey    │
│ password?    │       │ userId           │       │ location     │
└──────────────┘       │ disabled         │       │ ipAddress    │
                       │ paused           │       │ pendingPayouts│
                       │ ticks[] ────────►│◄────  │ ticks[]      │
                       └────────┬─────────┘       └──────┬───────┘
                                │  1:N                   │ 1:N
                                ▼                        ▼
                       ┌──────────────────────────────────┐
                       │         WebsiteTick              │
                       ├──────────────────────────────────┤
                       │ id           (PK)                │
                       │ websiteId    (FK → Website)      │
                       │ validatorId  (FK → Validator)    │
                       │ tick         (sequential index)  │
                       │ status       (Good | Bad)        │
                       │ latency      (ms)                │
                       │ createdAt                        │
                       └──────────────────────────────────┘
```

---

## API Reference

All endpoints (except `/health`) require a valid **Clerk JWT** in the `Authorization` header.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/health` | Health check | ❌ |
| `POST` | `/api/v1/website` | Add a new website to monitor | ✅ |
| `GET` | `/api/v1/websites` | List all monitored websites with ticks | ✅ |
| `GET` | `/api/v1/website/status?websiteId=<id>` | Get status & ticks for a specific website | ✅ |
| `DELETE` | `/api/v1/website/` | Soft-delete a website (sets `disabled: true`) | ✅ |
| `PUT` | `/api/v1/website/pause` | Toggle pause/resume on a website | ✅ |

### Example: Add a Website

```bash
curl -X POST http://localhost:8080/api/v1/website \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CLERK_JWT>" \
  -d '{"url": "https://example.com"}'
```

**Response:**
```json
{ "id": "550e8400-e29b-41d4-a716-446655440000" }
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 10.x
- **Docker** & **Docker Compose** (for PostgreSQL)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/upflux.git
cd upflux
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on `localhost:5432` with:
- **User:** `postgres`
- **Password:** `postgres`
- **Database:** `upflux`

### 4. Configure Environment Variables

```bash
# Root-level (for Prisma)
cp .env.example .env

# API server
cp apps/api/.env.example apps/api/.env   # if exists, or create manually

# Validator
cp apps/validator/.env.example apps/validator/.env  # if exists, or create manually

# Frontend
cp apps/frontend/.env.example apps/frontend/.env   # if exists, or create manually
```

See [Environment Variables](#environment-variables) section for required values.

### 5. Generate Prisma Client & Run Migrations

```bash
cd packages/db
npx prisma generate
npx prisma db push
cd ../..
```

### 6. Start All Services

```bash
npm run dev
```

This runs all apps concurrently via Turborepo:
- **Frontend** → `http://localhost:3000`
- **API** → `http://localhost:8080`
- **Hub** → `ws://localhost:8081`

### 7. Run a Validator Node

In a separate terminal:
```bash
cd apps/validator
npm run dev
```

---

## Environment Variables

| Variable | Service | Description |
|---|---|---|
| `DATABASE_URL` | `packages/db`, `hub`, `api` | PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/upflux`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `frontend` | Clerk publishable key for client-side auth |
| `CLERK_SECRET_KEY` | `frontend` | Clerk secret key for server-side auth |
| `PRIVATE_KEY` | `validator` | JSON-serialized Solana keypair secret key (e.g., output of `solana-keygen`) |

---

## Scripts

All scripts can be run from the repository root via Turborepo:

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in development mode with hot-reload |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all packages |
| `npm run format` | Format all `.ts`, `.tsx`, `.md` files with Prettier |
| `npm run check-types` | Run TypeScript type checking across all packages |

---

