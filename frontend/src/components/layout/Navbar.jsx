import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <header className="navbar">

      <h2>Dashboard</h2>

      <div className="navbar-right">

        <FaBell className="nav-icon" />

        <FaUserCircle className="nav-profile" />

      </div>

    </header>
  );
}

export default Navbar;