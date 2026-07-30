import AdminLayout from "../../layouts/AdminLayout";

import DashboardCard from "../../components/cards/DashboardCard";
import SalesChart from "../../components/cards/SalesChart";
import RecentOrders from "../../components/tables/RecentOrders";

import {
  FaGasPump,
  FaUsers,
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";

function Dashboard() {
  return (
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-8">
        Administrator Dashboard
      </h1>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Fuel Products"
          value="26"
          color="#2563EB"
          icon={<FaGasPump />}
        />

        <DashboardCard
          title="Customers"
          value="187"
          color="#16A34A"
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Orders"
          value="68"
          color="#EA580C"
          icon={<FaClipboardList />}
        />

        <DashboardCard
          title="Revenue"
          value="$53,200"
          color="#DC2626"
          icon={<FaDollarSign />}
        />

      </div>

      {/* Lower Section */}

      <div className="grid lg:grid-cols-3 gap-6 mt-10">

        {/* Chart */}

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Monthly Fuel Sales
          </h2>

          <SalesChart />

        </div>

        {/* Recent Orders */}

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recent Orders
          </h2>

          <RecentOrders />

        </div>

      </div>

    </AdminLayout>
  );
}

export default Dashboard;