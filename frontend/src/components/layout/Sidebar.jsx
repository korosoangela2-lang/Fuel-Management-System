import { NavLink } from "react-router-dom";
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
} from "react-icons/fa";

function Sidebar({ role = "admin", userRole }) {

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

  return (

    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 min-h-screen flex flex-col">

      <div className="px-6 py-6 flex items-center gap-3">

        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <FaGasPump className="text-white text-base" />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white leading-tight">
            FuelMS
          </h1>
          <p className="text-[11px] text-slate-500 leading-tight">
            Fuel Management
          </p>
        </div>

      </div>

      <nav className="mt-2 px-3 flex-1 space-y-1">

        {links.map(({ name, path, icon: Icon }) => (

          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon className="text-[15px] shrink-0 opacity-90" />
            <span>{name}</span>
          </NavLink>

        ))}

      </nav>

      <div className="px-6 py-5 mt-auto border-t border-slate-800/80">
        <p className="text-[11px] text-slate-600">
          &copy; {new Date().getFullYear()} FuelMS
        </p>
      </div>

    </aside>

  );
}

export default Sidebar;
