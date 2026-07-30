import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/useAuth";

function AdminLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}
      <Sidebar role="admin" userRole={user?.role} />

      {/* Main Section */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top Bar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
}

export default AdminLayout;