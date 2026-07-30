import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      {/* Page Title */}
      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <button className="relative">
          <FaBell className="text-xl text-gray-600" />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* User Menu */}
        <div className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>

            <div className="text-left">

              <p className="font-semibold">
                {user?.name || "Administrator"}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                {user?.role || "Admin"}
              </p>

            </div>

            <FaChevronDown />

          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border">

              <button
                className="block w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Profile
              </button>

              <button
                className="block w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Settings
              </button>

              <hr />

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
              >
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