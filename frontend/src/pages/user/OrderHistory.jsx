import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import Loader from "../../components/common/Loader";
import { fetchOrders } from "../../services/orderService";

function statusColor(status) {

  switch (status) {

    case "delivered":
      return "bg-green-100 text-green-700";

    case "approved":
      return "bg-indigo-100 text-indigo-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";

  }

}

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders({ mine: true })
      .then((result) => setOrders(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

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

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-slate-100">

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
                <td colSpan="5" className="text-center py-10 text-slate-500">
                  You haven't placed any orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t"
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

      </div>

    </UserLayout>

  );

}

export default OrderHistory;
