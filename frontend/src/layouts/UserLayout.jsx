import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Breadcrumb from "../components/layout/Breadcrumb";
import Footer from "../components/layout/Footer";

function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar role="customer" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">

        <Topbar />

        <Breadcrumb />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">

          {children}

        </main>

        <Footer />

      </div>

    </div>
  );
}

export default UserLayout;