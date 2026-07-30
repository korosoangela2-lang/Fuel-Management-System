import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/cards/DashboardCard";
import SalesChart from "../../components/cards/SalesChart";
import InventoryDonutChart from "../../components/cards/InventoryDonutChart";
import Loader from "../../components/common/Loader";
import { fetchDashboardReport, fetchRevenueReport } from "../../services/reportService";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status) {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    case "approved":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    default:
      return "bg-slate-800 text-slate-300";
  }
}

function Dashboard() {
  const navigate = useNavigate();
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

  const deliveriesToday = Object.values(stats?.deliveries || {}).reduce(
    (sum, count) => sum + Number(count || 0),
    0
  );

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Fuel Stock"
            value={Number(stats?.inventory?.total_stock ?? 0).toLocaleString()}
            subtitle="Litres across all products"
            color="#f59e0b"
          />

          <DashboardCard
            title="Pending Orders"
            value={stats?.pending_orders ?? 0}
            subtitle="Awaiting approval"
            color="#3b82f6"
          />

          <DashboardCard
            title="Revenue"
            value={`KES ${Number(stats?.total_revenue ?? 0).toLocaleString()}`}
            subtitle="Approved + fulfilled orders"
            color="#22c55e"
          />

          <DashboardCard
            title="Deliveries Today"
            value={deliveriesToday}
            subtitle={`${stats?.deliveries?.in_transit ?? 0} in transit`}
            color="#a855f7"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-slate-900 rounded-xl shadow p-6 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-6">
              Monthly Revenue
            </h2>

            <SalesChart
              labels={revenue.months.map((m) => m.month)}
              values={revenue.months.map((m) => Number(m.revenue))}
            />
          </div>

          <div className="bg-slate-900 rounded-xl shadow p-6 border border-slate-800">
            <h2 className="text-base font-bold text-white mb-6">
              Inventory by Type
            </h2>

            <InventoryDonutChart products={stats?.inventory?.products} />
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl shadow border border-slate-800 overflow-hidden">

          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">
              Recent Orders
            </h2>

            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              + New Order
            </button>
          </div>

          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[11px] font-mono uppercase tracking-wider text-slate-500 bg-slate-950/50">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.my_recent_orders || []).length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500 text-sm">
                    No recent orders yet.
                  </td>
                </tr>
              ) : (
                stats.my_recent_orders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-800/70">
                    <td className="px-6 py-3.5 font-mono text-amber-400 text-sm">{order.order_number}</td>
                    <td className="px-6 py-3.5 text-slate-300 text-sm">{order.customer || "—"}</td>
                    <td className="px-6 py-3.5 text-slate-300 text-sm font-mono">KES {Number(order.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-slate-500 text-sm">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                        {titleCase(order.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>

      </div>

    </AdminLayout>
  );
}

export default Dashboard;
