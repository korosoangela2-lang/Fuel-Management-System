import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaGasPump,
  FaClipboardList,
  FaUsers,
  FaTruck,
  FaChartBar,
  FaChartLine,
  FaUserShield,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Fuel Inventory",
      path: "/admin/fuel-inventory",
      icon: <FaGasPump />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FaClipboardList />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <FaUsers />,
    },
    {
      name: "Deliveries",
      path: "/admin/deliveries",
      icon: <FaTruck />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FaChartBar />,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <FaChartLine />,
    },
    {
      name: "User Management",
      path: "/admin/users",
      icon: <FaUserShield />,
    },
    {
      name: "System Settings",
      path: "/admin/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white shadow-xl">

      <div className="border-b border-slate-700 p-6">

        <h1 className="text-2xl font-bold text-blue-400">
          FuelMS
        </h1>

        <p className="text-sm text-slate-400">
          Administration
        </p>

      </div>

      <nav className="mt-4">

        {links.map((link) => (

          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >

            <span className="text-lg">
              {link.icon}
            </span>

            <span>
              {link.name}
            </span>

          </NavLink>

        ))}

      </nav>

    </aside>
  );
}

export default Sidebar;