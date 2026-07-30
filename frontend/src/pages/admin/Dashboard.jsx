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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Fuel Products"
          value="26"
          icon={<FaGasPump />}
          color="bg-blue-600"
        />

        <DashboardCard
          title="Customers"
          value="187"
          icon={<FaUsers />}
          color="bg-green-600"
        />

        <DashboardCard
          title="Orders"
          value="68"
          icon={<FaClipboardList />}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Revenue"
          value="$53,200"
          icon={<FaDollarSign />}
          color="bg-red-600"
        />

      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* Sales Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Monthly Fuel Sales
          </h2>

          <SalesChart />

        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6">

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