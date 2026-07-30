import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { fetchOrders } from "../../services/orderService";

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
      return "bg-slate-800 text-slate-200";

  }

}

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadOrders() {
      setLoading(true);
      return fetchOrders({ mine: true, page })
        .then((result) => {
          setOrders(result.items || []);
          setMeta(result.meta || null);
        })
        .catch((error) => toast.error(error.message || "Could not load your orders."))
        .finally(() => setLoading(false));
    }

    void Promise.resolve().then(loadOrders);
  }, [page]);

  if (loading) {
    return (
      <UserLayout>
        <Loader label="Loading your orders..." />
      </UserLayout>
    );
  }

  return (

    <UserLayout>

      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      <div className="bg-slate-900 rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="text-left px-6 py-4">
                Order
              </th>

              <th className="text-left px-6 py-4">
                Customer
              </th>

              <th className="text-left px-6 py-4">
                Total
              </th>

              <th className="text-left px-6 py-4">
                Date
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-400">
                  You haven't placed any orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t border-slate-800"
                >

                  <td className="px-6 py-4">
                    {order.order_number}
                  </td>

                  <td className="px-6 py-4">
                    {order.customer_name || "—"}
                  </td>

                  <td className="px-6 py-4">
                    KES {Number(order.total_amount).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                        order.status
                      )}`}
                    >
                      {titleCase(order.status)}
                    </span>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

        <Pagination meta={meta} onPageChange={setPage} />

      </div>

    </UserLayout>

  );

}

export default OrderHistory;
