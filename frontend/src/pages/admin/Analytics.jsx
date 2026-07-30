import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import SalesChart from "../../components/cards/SalesChart";
import { fetchRevenueReport, fetchConsolidatedReport } from "../../services/reportService";
import { useAuth } from "../../context/useAuth";

function Analytics() {
  const { user } = useAuth();
  const [revenue, setRevenue] = useState({ months: [] });
  const [consolidated, setConsolidated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requests = [fetchRevenueReport()];
    if (user?.role === "super_admin") {
      requests.push(fetchConsolidatedReport());
    }

    Promise.all(requests)
      .then(([revenueReport, consolidatedReport]) => {
        setRevenue(revenueReport);
        if (consolidatedReport) setConsolidated(consolidatedReport);
      })
      .catch((error) => toast.error(error.message || "Could not load analytics."))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) {
    return (
      <AdminLayout>
        <Loader label="Loading analytics..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-slate-400 mt-1">Revenue trends and regional performance.</p>
        </div>

        <div className="bg-slate-900 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <SalesChart
            labels={revenue.months.map((m) => m.month)}
            values={revenue.months.map((m) => Number(m.revenue))}
          />
        </div>

        {consolidated && (
          <div className="bg-slate-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Cross-Region Performance</h2>

            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-slate-400">
                  <th className="py-2">Region</th>
                  <th className="py-2">Orders</th>
                  <th className="py-2">Revenue</th>
                  <th className="py-2">Customers</th>
                </tr>
              </thead>
              <tbody>
                {consolidated.regions.map((region) => (
                  <tr key={region.region_id} className="border-t border-slate-800">
                    <td className="py-3">{region.region_name || `Region ${region.region_id}`}</td>
                    <td className="py-3">{region.orders}</td>
                    <td className="py-3">KES {Number(region.revenue).toLocaleString()}</td>
                    <td className="py-3">{region.customers}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-800 font-semibold">
                  <td className="py-3">Total</td>
                  <td className="py-3">{consolidated.totals.orders}</td>
                  <td className="py-3">KES {Number(consolidated.totals.revenue).toLocaleString()}</td>
                  <td className="py-3">{consolidated.totals.customers}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

      </div>

    </AdminLayout>
  );
}

export default Analytics;
