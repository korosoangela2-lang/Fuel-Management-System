# FuelMS Frontend

React + Vite + Tailwind CSS frontend for the Fuel Management System. See the
[repo root README](../README.md) for the full project overview, backend
setup and seeded accounts.

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
```

Set `VITE_API_URL` in a `.env.local` file only if the backend isn't running
at the default `http://127.0.0.1:5000/api` (see `.env.example`).

## Scripts

| Command           | Purpose                          |
|-------------------|-----------------------------------|
| `npm run dev`      | Start the Vite dev server         |
| `npm run build`    | Production build to `dist/`       |
| `npm run preview`  | Preview a production build        |
| `npm run lint`     | ESLint                            |

## Structure

```
src/
  api/axios.js          Axios instance: base URL, auth header, error unwrapping
  services/              One file per backend resource (fuelService, orderService, ...)
  context/                Auth context + useAuth hook
  routes/                 AppRoutes, ProtectedRoute (role-gated), GuestRoute
  layouts/                AdminLayout, UserLayout, AuthLayout
  components/
    common/                Shared primitives: Button, Input, Modal, Pagination, Loader...
    forms/                  Domain forms: LoginForm, OrderForm, FuelForm...
    layout/                 Sidebar, Topbar, Footer
    cards/, tables/         Dashboard cards, charts, data tables
  pages/
    admin/                  Super admin / regional admin pages
    user/                   Staff-facing pages
    auth/, shared/          Login/Register/ForgotPassword, Home, NotFound, Unauthorized
  hooks/useDebounce.js    Debounced value hook (used for live search)
  utils/roles.js          Role constants + role → home route mapping
```

Routing and page access are role-gated: `ProtectedRoute` checks the signed-in
user's role against an `allowedRoles` list (see `utils/roles.js`), and
`GuestRoute` keeps signed-in users off the login/register/forgot-password
screens.
