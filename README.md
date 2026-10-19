# 🛕 Tirthstal — Sacred Temples, Divine Journey

A full-stack platform to discover temples, festivals and sacred journeys
across India — now with **Goseva (गौसेवा)**: a gaushala directory with
seva pledges, donations and volunteering.

## Project Structure

| Folder | What it is | Stack |
| --- | --- | --- |
| `tirthstal/` | Public website | React 19 + Vite + React Router |
| `backend/` | REST API | Node.js + Express 5 + MongoDB (Mongoose) |
| `TirthStal-Admin-Panel/` | Admin UI (forms, dashboard) | React + Vite |

## Quick Start

### 1. Backend (API — port 3000)

```bash
cd backend
cp .env.example .env      # fill MONGO_URI, JWT_SECRET, email settings
npm install
npm run seed:goseva       # optional: seed the gaushala directory
npm run dev               # or: npm start
```

Health check: `GET http://localhost:3000/api/health`

### 2. Website (port 5173)

```bash
cd tirthstal
npm install
npm run dev
```

`tirthstal/.env` holds `VITE_API_URL` (default `http://localhost:3000/api`).
The site also works **without** the backend — pages fall back to the
local data in `src/data/*`.

### 3. Admin Panel

```bash
cd TirthStal-Admin-Panel
npm install
npm run dev
```

## 🐄 Goseva Feature

**Page:** `/goseva` (`tirthstal/src/pages/goseva/index.jsx`)
— gaushala directory with search/state/need filters, detail view,
6 ways to serve (Gau Daan, Chara Seva, Adopt a Cow, Medical, Volunteer,
Other), a seva-sankalp (pledge) form, "My Seva Pledges" history and FAQs.
Also linked from the Navbar, Footer and a home-page banner.

**API:** mounted at `/api/goseva`

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/goseva/stats` | Public | Totals for the page header |
| GET | `/api/goseva/gaushalas?search=&state=&district=&need=&page=&limit=` | Public | Directory |
| GET | `/api/goseva/gaushalas/:slug` | Public | One gaushala |
| POST | `/api/goseva/gaushalas` | Admin | Add gaushala |
| PUT / DELETE | `/api/goseva/gaushalas/:id` | Admin | Edit / soft-delete |
| POST | `/api/goseva/pledges` | Public (user attached if logged in) | Record a seva pledge |
| GET | `/api/goseva/pledges/mine` | Logged-in user | My pledges |
| GET | `/api/goseva/pledges?status=&sevaType=` | Admin | All pledges |
| PUT | `/api/goseva/pledges/:id/status` | Admin | pending → confirmed → completed |

**How pledges work:** the website records the devotee's *pledge/intent*
(name, contact, gaushala, seva type, amount). No online payment is
collected yet — the gaushala contacts the devotee to complete the seva.
A payment gateway (Razorpay/UPI) can be plugged into
`createPledge` later; the `status` workflow already supports it.
If the API is unreachable, the pledge is saved on the visitor's device
(localStorage) and the page clearly says so.

**Data:** sample listings live in `backend/seeds/gaushalaData.js`
(mirrored for offline use in `tirthstal/src/data/gaushalas.js` — keep
`slug`s in sync). Replace phone numbers/details with verified ones
before launch.

## Scripts

| Where | Command | Does |
| --- | --- | --- |
| `tirthstal/` | `npm run build` | Production build (routes are code-split) |
| `tirthstal/` | `npm run lint` | ESLint |
| `backend/` | `npm run seed:goseva` | Upsert gaushalas into MongoDB |

## Notes

- Pages are lazily loaded per route (`React.lazy`) — first load only
  downloads the shell + current page.
- Auth uses JWT (`Authorization: Bearer …`, stored as `tirthstal_token`).
- `backend/.env.example` documents every required environment variable.
