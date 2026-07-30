import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaChevronDown } from "react-icons/fa";

import { useAuth } from "../../context/useAuth";

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
        </button>

        {/* User Menu */}
        <div className="relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3"
          >

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-left">

              <p className="font-semibold">
                {user?.username || "Account"}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                {user?.role?.replaceAll("_", " ") || ""}
              </p>

            </div>

            <FaChevronDown />

          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border z-10">

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/profile");
                }}
                className="block w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/settings");
                }}
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
