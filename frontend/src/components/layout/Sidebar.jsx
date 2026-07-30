import { NavLink, useNavigate } from "react-router-dom";
import {
  FaGasPump,
  FaClipboardList,
  FaUsers,
  FaTruck,
  FaChartBar,
  FaChartLine,
  FaUserShield,
  FaCog,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaHistory,
  FaUserCircle,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/useAuth";

function Sidebar({ role = "admin", userRole }) {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FaTachometerAlt },
    { name: "Fuel Inventory", path: "/admin/fuel-inventory", icon: FaGasPump },
    { name: "Orders", path: "/admin/orders", icon: FaClipboardList },
    { name: "Customers", path: "/admin/customers", icon: FaUsers },
    { name: "Deliveries", path: "/admin/deliveries", icon: FaTruck },
    { name: "Reports", path: "/admin/reports", icon: FaChartBar },
    { name: "Analytics", path: "/admin/analytics", icon: FaChartLine },

    // Super-admin only — regional admins can't manage users/regions.
    ...(userRole === "super_admin"
      ? [
          { name: "User Management", path: "/admin/users", icon: FaUserShield },
          { name: "System Settings", path: "/admin/settings", icon: FaCog },
        ]
      : []),

  ];

  const customerLinks = [
    { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
    { name: "Available Fuel", path: "/available-fuel", icon: FaGasPump },
    { name: "Fuel Orders", path: "/fuel-orders", icon: FaShoppingCart },
    { name: "Delivery Tracking", path: "/delivery-tracking", icon: FaMapMarkerAlt },
    { name: "Order History", path: "/order-history", icon: FaHistory },
    { name: "Reports", path: "/reports", icon: FaChartBar },
    { name: "Profile", path: "/profile", icon: FaUserCircle },
    { name: "Settings", path: "/settings", icon: FaCog },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : customerLinks;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (

    <aside className="w-64 shrink-0 bg-slate-950 border-r border-slate-800/70 text-slate-300 min-h-screen flex flex-col">

      <div className="px-5 py-6 flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <FaGasPump className="text-slate-950 text-base" />
        </div>

        <div>
          <h1 className="text-base font-bold text-white leading-tight tracking-tight">
            FuelMS
          </h1>
          <p className="text-[10px] font-mono text-slate-400 leading-tight uppercase tracking-wider">
            {role === "admin" ? "Admin" : "Portal"}
          </p>
        </div>

      </div>

      <nav className="mt-2 px-3 flex-1 space-y-0.5">

        {links.map(({ name, path, icon: Icon }) => (

          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-2 ${
                isActive
                  ? "bg-amber-500/10 text-amber-400 border-amber-500"
                  : "text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-100"
              }`
            }
          >
            <Icon className="text-[15px] shrink-0 opacity-90" />
            <span>{name}</span>
          </NavLink>

        ))}

      </nav>

      <div className="px-3 py-4 mt-auto border-t border-slate-800/70">

        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">

          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-semibold shrink-0">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate">
              {user?.username || "Account"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-amber-400 transition-colors p-1.5"
          >
            <FaSignOutAlt />
          </button>

        </div>

      </div>

    </aside>

  );
}

export default Sidebar;
