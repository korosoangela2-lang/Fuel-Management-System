import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

import { useAuth } from "../../context/useAuth";

function pageTitle(pathname) {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment) return "Dashboard";
  return segment.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <header className="bg-white/90 backdrop-blur border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">

      {/* Page Title */}
      <h2 className="text-xl font-bold text-slate-800">
        {pageTitle(location.pathname)}
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Notifications */}
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <FaBell className="text-lg" />
        </button>

        {/* User Menu */}
        <div className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
          >

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-semibold shadow-sm">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-left hidden sm:block">

              <p className="font-semibold text-sm text-slate-800 leading-tight">
                {user?.username || "Account"}
              </p>

              <p className="text-xs text-slate-500 capitalize leading-tight">
                {user?.role?.replaceAll("_", " ") || ""}
              </p>

            </div>

            <FaChevronDown className="text-xs text-slate-400" />

          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-10 overflow-hidden py-1">

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <FaUserCircle className="text-slate-400" />
                Profile
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/settings");
                }}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <FaCog className="text-slate-400" />
                Settings
              </button>

              <hr className="my-1 border-slate-100" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Topbar;
