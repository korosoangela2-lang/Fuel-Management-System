import { NavLink } from "react-router-dom";

function Sidebar({ role = "admin", userRole }) {

  const adminLinks = [

    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      name: "Fuel Inventory",
      path: "/admin/fuel-inventory",
    },

    {
      name: "Orders",
      path: "/admin/orders",
    },

    {
      name: "Customers",
      path: "/admin/customers",
    },

    {
      name: "Deliveries",
      path: "/admin/deliveries",
    },

    {
      name: "Reports",
      path: "/admin/reports",
    },

    {
      name: "Analytics",
      path: "/admin/analytics",
    },

    // Super-admin only — regional admins can't manage users/regions.
    ...(userRole === "super_admin"
      ? [
          {
            name: "User Management",
            path: "/admin/users",
          },
          {
            name: "System Settings",
            path: "/admin/settings",
          },
        ]
      : []),

  ];

  const customerLinks = [

    {
      name: "Dashboard",
      path: "/dashboard",
    },

    {
      name: "Available Fuel",
      path: "/available-fuel",
    },

    {
      name: "Fuel Orders",
      path: "/fuel-orders",
    },

    {
      name: "Delivery Tracking",
      path: "/delivery-tracking",
    },

    {
      name: "Order History",
      path: "/order-history",
    },

    {
      name: "Reports",
      path: "/reports",
    },

    {
      name: "Profile",
      path: "/profile",
    },

    {
      name: "Settings",
      path: "/settings",
    },

  ];

  const links =
    role === "admin"
      ? adminLinks
      : customerLinks;

  return (

    <aside className="w-64 bg-slate-900 text-white min-h-screen">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold">

          FuelMS

        </h1>

      </div>

      <nav className="mt-6">

        {links.map((link) => (

          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-6 py-3 transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >

            {link.name}

          </NavLink>

        ))}

      </nav>

    </aside>

  );
}

export default Sidebar;