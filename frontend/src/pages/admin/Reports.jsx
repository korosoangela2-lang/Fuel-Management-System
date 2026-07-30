import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import {
  fetchSalesReport,
  fetchTopCustomersReport,
  fetchDeliveriesReport,
} from "../../services/reportService";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Reports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sales, setSales] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState(null);
  const [loading, setLoading] = useState(true);

  function loadReports() {
    setLoading(true);
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return Promise.all([
      fetchSalesReport(params),
      fetchTopCustomersReport(),
      fetchDeliveriesReport(),
    ])
      .then(([salesReport, topCustomersReport, deliveriesReport]) => {
        setSales(salesReport);
        setTopCustomers(topCustomersReport.top_customers || []);
        setDeliveries(deliveriesReport);
      })
      .catch((error) => toast.error(error.message || "Could not load reports."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadReports);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilter(event) {
    event.preventDefault();
    loadReports();
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-slate-500 mt-1">Sales, deliveries and top customers for your region.</p>
        </div>

        <form onSubmit={handleFilter} className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-slate-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700">
            Apply
          </button>
        </form>

        {loading ? (
          <Loader label="Loading reports..." />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-slate-500 text-sm">Total Orders</p>
                <h2 className="text-3xl font-bold mt-2">{sales?.total_orders ?? 0}</h2>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-slate-500 text-sm">Total Revenue</p>
                <h2 className="text-3xl font-bold mt-2">
                  KES {Number(sales?.total_revenue ?? 0).toLocaleString()}
                </h2>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-slate-500 text-sm">Total Deliveries</p>
                <h2 className="text-3xl font-bold mt-2">{deliveries?.total ?? 0}</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Orders by Status</h2>
                <div className="space-y-2">
                  {Object.entries(sales?.orders_by_status || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm border-b pb-2">
                      <span>{titleCase(status)}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Deliveries by Status</h2>
                <div className="space-y-2">
                  {Object.entries(deliveries?.by_status || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-sm border-b pb-2">
                      <span>{titleCase(status)}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Top Customers</h2>
              {topCustomers.length === 0 ? (
                <p className="text-slate-500 text-sm">No customer revenue recorded yet.</p>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-500">
                      <th className="py-2">Customer</th>
                      <th className="py-2">Orders</th>
                      <th className="py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer) => (
                      <tr key={customer.customer_id} className="border-t">
                        <td className="py-3">{customer.name}</td>
                        <td className="py-3">{customer.orders}</td>
                        <td className="py-3">KES {Number(customer.revenue).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      </div>

    </AdminLayout>
  );
}

export default Reports;
