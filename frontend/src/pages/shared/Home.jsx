import { Link } from "react-router-dom";
import {
  FaGasPump,
  FaClipboardList,
  FaUsers,
  FaTruck,
  FaChartBar,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";

import { useAuth } from "../../context/useAuth";
import { homeRouteFor } from "../../utils/roles";

const FEATURES = [
  {
    icon: FaGasPump,
    title: "Fuel Inventory",
    description: "Track stock levels, reorder thresholds and pricing for every product, per region.",
  },
  {
    icon: FaClipboardList,
    title: "Orders",
    description: "Raise, approve and cancel orders with a full line-item and audit trail.",
  },
  {
    icon: FaTruck,
    title: "Deliveries",
    description: "Schedule dispatches and track every delivery from pending to delivered.",
  },
  {
    icon: FaUsers,
    title: "Customers",
    description: "Keep customer accounts, credit limits and order history in one place.",
  },
  {
    icon: FaChartBar,
    title: "Reports & Analytics",
    description: "Sales, revenue and delivery reports, with cross-region comparisons for admins.",
  },
  {
    icon: FaUserShield,
    title: "Role-Based Access",
    description: "Super admin, regional admin and staff roles, each scoped to their own region.",
  },
];

const PROBLEMS = [
  "Inaccurate inventory records from manual entry",
  "Delayed deliveries due to poor coordination",
  "Duplicated customer and order data",
  "Limited reporting and analytics capability",
  "No real-time stock monitoring across sites",
  "Inefficient inter-department communication",
];

function Home() {
  const { isAuthenticated, user } = useAuth();
  const primaryTarget = isAuthenticated ? homeRouteFor(user?.role) : "/login";
  const primaryLabel = isAuthenticated ? "Open Dashboard" : "Sign In";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Nav */}
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <FaGasPump className="text-slate-950 text-sm" />
            </div>
            <span className="font-bold text-white">FuelMS</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#stack" className="hover:text-white transition-colors">Stack</a>
          </nav>

          <Link
            to={primaryTarget}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {primaryLabel}
          </Link>

        </div>
      </header>

      {/* Hero */}
      <section id="overview" className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">

        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4">
            Fuel Operations Platform
          </p>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Fuel operations,<br />
            <span className="text-amber-400">under control.</span>
          </h1>

          <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-lg">
            A centralized platform replacing spreadsheets with real-time inventory
            tracking, order processing and delivery coordination — built for
            regional fuel distributors.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={primaryTarget}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              {primaryLabel} <FaArrowRight className="text-sm" />
            </Link>

            {!isAuthenticated && (
              <Link
                to="/register"
                className="border border-slate-700 hover:bg-slate-900 text-slate-200 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Register
              </Link>
            )}
          </div>
        </div>

        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-4">
            Operations Snapshot
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Fuel in stock</p>
              <p className="text-2xl font-bold font-mono text-amber-400">144,500 L</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Active orders</p>
              <p className="text-2xl font-bold font-mono text-blue-400">14</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Revenue this month</p>
              <p className="text-2xl font-bold font-mono text-green-400">KES 2.4M</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Deliveries today</p>
              <p className="text-2xl font-bold font-mono text-purple-400">6</p>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-slate-600">Illustrative preview — sign in to see your region's live data.</p>
        </div>

      </section>

      {/* Problem */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900">

        <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">The Problem</p>
        <h2 className="text-3xl font-bold mb-3">Why manual systems fail</h2>
        <p className="text-slate-400 max-w-2xl mb-10">
          Fuel distribution companies still rely on spreadsheets and paper forms —
          creating bottlenecks at every step.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {PROBLEMS.map((problem, i) => (
            <div key={problem} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
              <span className="text-amber-400 font-mono text-sm shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-slate-300 text-sm">{problem}</span>
            </div>
          ))}
        </div>

      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900">

        <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">Features</p>
        <h2 className="text-3xl font-bold mb-10">Everything your operation needs</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Icon />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </section>

      {/* Stack */}
      <section id="stack" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900">

        <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3">Stack</p>
        <h2 className="text-3xl font-bold mb-10">Built with</h2>

        <div className="flex flex-wrap gap-3">
          {["React", "Vite", "Tailwind CSS", "Flask", "SQLAlchemy", "JWT Auth", "Chart.js"].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-mono text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>

      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-900 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get your fuel operations under control?</h2>
        <Link
          to={primaryTarget}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {primaryLabel} <FaArrowRight className="text-sm" />
        </Link>
      </section>

      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Fuel Management System
      </footer>

    </div>
  );
}

export default Home;
