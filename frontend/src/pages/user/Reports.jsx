import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import Loader from "../../components/common/Loader";
import { fetchDashboardReport, fetchInventoryReport } from "../../services/reportService";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardReport(), fetchInventoryReport()])
      .then(([dashboardReport, inventoryReport]) => {
        setDashboard(dashboardReport);
        setInventory(inventoryReport);
      })
      .catch((error) => toast.error(error.message || "Could not load reports."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <Loader label="Loading reports..." />
      </UserLayout>
    );
  }

  return (
    <UserLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-slate-500 mt-1">A snapshot of activity in your region.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-500 text-sm">Fuel Products</p>
            <h2 className="text-3xl font-bold mt-2">{inventory?.product_count ?? 0}</h2>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Stock</p>
            <h2 className="text-3xl font-bold mt-2">{Number(inventory?.total_stock ?? 0).toLocaleString()}</h2>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-slate-500 text-sm">Pending Orders</p>
            <h2 className="text-3xl font-bold mt-2">{dashboard?.pending_orders ?? 0}</h2>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Deliveries by Status</h2>
          <div className="space-y-2">
            {Object.entries(dashboard?.deliveries || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm border-b pb-2">
                <span>{titleCase(status)}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </UserLayout>
  );
}

export default Reports;
