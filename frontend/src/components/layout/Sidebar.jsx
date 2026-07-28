import {
  FaTachometerAlt,
  FaGasPump,
  FaUsers,
  FaClipboardList,
  FaTruck,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Fuel Inventory", path: "/admin/fuel", icon: <FaGasPump /> },
    { name: "Customers", path: "/admin/customers", icon: <FaUsers /> },
    { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
    { name: "Deliveries", path: "/admin/deliveries", icon: <FaTruck /> },
    { name: "Reports", path: "/admin/reports", icon: <FaChartBar /> },
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>FuelMS</h2>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="sidebar-link"
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn">
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;