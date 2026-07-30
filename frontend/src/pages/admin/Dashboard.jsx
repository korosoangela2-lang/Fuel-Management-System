import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/cards/DashboardCard";
import SalesChart from "../../components/cards/SalesChart";
import RecentOrders from "../../components/tables/RecentOrders";
import Loader from "../../components/common/Loader";
import { fetchDashboardReport, fetchRevenueReport } from "../../services/reportService";

import {
  FaGasPump,
  FaUsers,
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState({ months: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardReport(), fetchRevenueReport()])
      .then(([dashboard, revenueReport]) => {
        setStats(dashboard);
        setRevenue(revenueReport);
      })
      .catch((error) => toast.error(error.message || "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Loader label="Loading dashboard..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">
        Administrator Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Fuel Products"
          value={stats?.inventory?.product_count ?? 0}
          color="#2F80ED"
          icon={<FaGasPump />}
        />

        <DashboardCard
          title="Customers"
          value={stats?.total_customers ?? 0}
          color="#27AE60"
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Pending Orders"
          value={stats?.pending_orders ?? 0}
          color="#F2994A"
          icon={<FaClipboardList />}
        />

        <DashboardCard
          title="Revenue"
          value={`KES ${Number(stats?.total_revenue ?? 0).toLocaleString()}`}
          color="#EB5757"
          icon={<FaDollarSign />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Monthly Revenue
          </h2>

          <SalesChart
            labels={revenue.months.map((m) => m.month)}
            values={revenue.months.map((m) => Number(m.revenue))}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">
            Recent Orders
          </h2>

          <RecentOrders orders={stats?.my_recent_orders} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
