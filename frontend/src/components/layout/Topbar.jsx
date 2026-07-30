import {
  FaBell,
  FaSearch,
} from "react-icons/fa";

function Topbar() {
  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4">

      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">

        <div className="relative">

          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <button className="relative">

          <FaBell className="text-2xl text-gray-600" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
            3
          </span>

        </button>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>

          <div>

            <h4 className="font-semibold">
              Admin
            </h4>

            <p className="text-sm text-gray-500">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;