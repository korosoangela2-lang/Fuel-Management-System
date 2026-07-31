# FuelMS — Fuel Management System

A centralized platform for regional fuel distributors, replacing spreadsheets with
real-time inventory tracking, order processing, delivery coordination and
role-scoped reporting.

- **Backend:** Flask + SQLAlchemy + Flask-JWT-Extended, region-scoped multi-tenant API
- **Frontend:** React 19 + Vite + React Router + Tailwind CSS 4

## Features

- **Fuel inventory** — stock levels, reorder thresholds, per-region pricing
- **Orders** — line-item orders with an approve / cancel / delete workflow and audit trail
- **Deliveries** — schedule dispatches and track status from pending to delivered
- **Customers** — accounts, credit limits and order history
- **Reports & analytics** — sales, revenue and delivery reports, with a cross-region view for the super admin
- **Role-based access** — `super_admin`, `regional_admin` and `user` roles, each scoped to their own region

## Project structure

```
backend/    Flask API (app/, run.py, seed.py, tests/)
frontend/   React app (src/pages, src/components, src/services)
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- SQLite (default, no setup needed) or PostgreSQL if you set `DATABASE_URL`

## Backend setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # then edit SECRET_KEY / JWT_SECRET_KEY
python seed.py                   # creates the DB and seeds sample data
python run.py                    # serves the API on http://127.0.0.1:5000
```

By default the API uses a local SQLite file (`backend/app/fuel_dev.db`) — set
`DATABASE_URL` in `.env` to point at Postgres instead if you want one.

### Seeded accounts

`seed.py` creates three regions (Nairobi, Mombasa, Kisumu) and one user per role.
Every account uses the password **`ChangeMe123!`**:

| Username     | Role            | Region  |
|--------------|-----------------|---------|
| `root`       | Super Admin     | —       |
| `nrb_admin`  | Regional Admin  | Nairobi |
| `nrb_staff`  | User            | Nairobi |
| `msa_admin`  | Regional Admin  | Mombasa |
| `msa_staff`  | User            | Mombasa |
| `ksm_admin`  | Regional Admin  | Kisumu  |
| `ksm_staff`  | User            | Kisumu  |

### Run the backend tests

```bash
cd backend
pytest
```

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local       # only needed if the API isn't at the default URL
npm run dev                      # serves the app on http://localhost:5173
```

`VITE_API_URL` defaults to `http://127.0.0.1:5000/api` — only set it if your
backend runs somewhere else.

Other frontend commands:

```bash
npm run build     # production build
npm run lint       # ESLint
npm run preview    # preview a production build locally
```

## Deployment

The frontend and backend deploy to separate hosts — Vercel doesn't fit the
backend (its serverless functions are stateless, so the default SQLite file
wouldn't persist between requests).

### Backend → Render

A `render.yaml` blueprint at the repo root provisions both the web service
and a free Postgres database in one step:

1. Push to GitHub, then in Render: **New +** → **Blueprint** → select this repo.
2. Render reads `render.yaml`, creates the `fuelms-backend` web service and
   `fuelms-db` database, and wires `DATABASE_URL` between them automatically.
   `SECRET_KEY` / `JWT_SECRET_KEY` are auto-generated.
3. Once it's live, open the service's **Shell** tab and run `python seed.py`
   once to create the tables and seed the sample accounts.
4. Note the resulting URL (e.g. `https://fuelms-backend.onrender.com`) — the
   API lives at `<that URL>/api`.

### Frontend → Vercel

1. Import the repo in Vercel and set **Root Directory** to `frontend`.
2. Add an environment variable **`VITE_API_URL`** = `<your Render URL>/api`.
3. `frontend/vercel.json` already handles the SPA rewrite (client-side
   routes like `/admin/dashboard` need every path to fall back to
   `index.html`, otherwise they 404 on direct load/refresh).

Redeploy after setting the env var — Vercel doesn't pick up new environment
variables on already-built deployments.

## API overview

All endpoints are JSON and prefixed with `/api`. Requests (other than
register/login/the public region list) require a `Bearer` JWT from
`/api/auth/login`.

| Base path             | Covers                                  |
|------------------------|------------------------------------------|
| `/api/auth`            | register, login, refresh, logout, me, password reset |
| `/api/profile`         | current user's profile + password change |
| `/api/fuels`           | fuel inventory, stock adjustments        |
| `/api/customers`       | customer accounts                        |
| `/api/orders`          | orders, approve/cancel/delete            |
| `/api/distributions`   | delivery scheduling and status, tracking |
| `/api/reports`         | dashboard, sales, revenue, deliveries, top customers, consolidated (super admin) |
| `/api/users`           | staff account management (super admin)   |
| `/api/regions`         | region management (super admin)          |
| `/api/refineries`      | refinery/depot management                |

Errors share one envelope: `{"error": {"code", "message", "details"}}`.

## Roles & region scoping

- **`super_admin`** — no region of their own; sees/manages all regions and must
  specify a `region_id` explicitly when creating region-scoped records.
- **`regional_admin`** — full access within their own region (manage inventory,
  approve orders, schedule deliveries, manage customers).
- **`user`** — day-to-day staff access within their own region (place orders,
  view inventory, track deliveries).

Every region-scoped query is automatically filtered server-side by the
caller's region — a regional admin or user can never see another region's data.
