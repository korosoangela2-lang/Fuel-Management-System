import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="dashboard-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;