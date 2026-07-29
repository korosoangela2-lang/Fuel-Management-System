import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Breadcrumb from "../components/layout/Breadcrumb";
import Footer from "../components/layout/Footer";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">

        {/* Top Bar */}
        <Topbar />

        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
}

export default AdminLayout;