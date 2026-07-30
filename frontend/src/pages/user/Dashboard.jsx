import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import DashboardCard from "../../components/cards/DashboardCard";
import InventoryDonutChart from "../../components/cards/InventoryDonutChart";
import RecentOrders from "../../components/tables/RecentOrders";
import Loader from "../../components/common/Loader";
import { fetchDashboardReport } from "../../services/reportService";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardReport()
      .then(setStats)
      .catch((error) => toast.error(error.message || "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <Loader label="Loading dashboard..." />
      </UserLayout>
    );
  }

  const deliveriesInFlight = Object.values(stats?.deliveries || {}).reduce(
    (sum, count) => sum + Number(count || 0),
    0
  );

  return (
    <UserLayout>

      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <DashboardCard
            title="Fuel Products"
            value={stats?.inventory?.product_count ?? 0}
            subtitle={`${Number(stats?.inventory?.total_stock ?? 0).toLocaleString()} litres in stock`}
            color="#f59e0b"
          />

          <DashboardCard
            title="Recent Orders"
            value={stats?.my_recent_orders?.length ?? 0}
            subtitle="Placed by you"
            color="#3b82f6"
          />

          <DashboardCard
            title="Deliveries"
            value={deliveriesInFlight}
            subtitle={`${stats?.deliveries?.in_transit ?? 0} in transit`}
            color="#a855f7"
          />

          <DashboardCard
            title="Pending Orders"
            value={stats?.pending_orders ?? 0}
            subtitle="Region-wide"
            color="#22c55e"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          <div className="bg-slate-900 rounded-xl shadow p-6 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-6">
              Inventory by Type
            </h2>

            <InventoryDonutChart products={stats?.inventory?.products} />
          </div>

          <div className="xl:col-span-2 bg-slate-900 rounded-xl shadow p-6 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-6">
              Your Recent Orders
            </h2>

            <RecentOrders orders={stats?.my_recent_orders} />
          </div>

        </div>

      </div>

    </UserLayout>
  );
}

export default Dashboard;
