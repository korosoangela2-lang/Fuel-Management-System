import { useLocation } from "react-router-dom";
import { FaBell } from "react-icons/fa";

function pageTitle(pathname) {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment) return "Dashboard";
  return segment.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Topbar() {
  const location = useLocation();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800/70 px-6 py-4 flex justify-between items-center sticky top-0 z-20">

      <div>
        <h2 className="text-xl font-bold text-white">
          {pageTitle(location.pathname)}
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          {today}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-amber-400 transition-colors">
          <FaBell className="text-lg" />
        </button>

      </div>

    </header>
  );
}

export default Topbar;
