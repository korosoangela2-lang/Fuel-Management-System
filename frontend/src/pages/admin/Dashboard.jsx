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
      <h1 className="text-3xl font-bold mb-6">
        Administrator Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Fuel Products"
          value="26"
          color="#2F80ED"
          icon={<FaGasPump />}
        />

        <DashboardCard
          title="Customers"
          value="187"
          color="#27AE60"
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Orders"
          value="68"
          color="#F2994A"
          icon={<FaClipboardList />}
        />

        <DashboardCard
          title="Revenue"
          value="$53,200"
          color="#EB5757"
          icon={<FaDollarSign />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Monthly Fuel Sales
          </h2>

          <SalesChart />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Recent Orders
          </h2>

          <RecentOrders />
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;