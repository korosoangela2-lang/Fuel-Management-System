import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import OrderForm from "../../components/forms/OrderForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import Loader from "../../components/common/Loader";
import { fetchOrders, createOrder, approveOrder, cancelOrder, deleteOrder } from "../../services/orderService";
import { fetchCustomers } from "../../services/customerService";
import { fetchFuels } from "../../services/fuelService";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function badgeColor(status) {

  switch (status) {

    case "delivered":
      return "bg-green-100 text-green-700";

    case "approved":
      return "bg-blue-100 text-blue-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";

  }

}

function Orders() {

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);

  function loadOrders() {
    setLoading(true);
    return fetchOrders()
      .then((result) => setOrders(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load orders."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    void Promise.resolve().then(loadOrders);
    fetchCustomers({ is_active: true }).then((result) => setCustomers(result.items || [])).catch(() => {});
    fetchFuels().then((result) => setFuels(result.items || [])).catch(() => {});
  }, []);

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const term = searchTerm.toLowerCase();

      const matchesSearch =
        order.order_number.toLowerCase().includes(term) ||
        (order.customer_name || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;

    });

  }, [orders, searchTerm, statusFilter]);

  async function handleSaveOrder(order) {
    if (!order.items.length) {
      toast.error("Add at least one fuel line item.");
      return;
    }

    setSaving(true);
    try {
      await createOrder(order);
      toast.success("Order created.");
      setShowModal(false);
      await loadOrders();
    } catch (error) {
      toast.error(error.message || "Could not create this order.");
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove(order) {
    setSaving(true);
    try {
      await approveOrder(order.id);
      toast.success(`${order.order_number} approved.`);
      await loadOrders();
    } catch (error) {
      toast.error(error.message || "Could not approve this order.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelClick(order) {
    setSelectedOrder(order);
    setCancelReason("");
    setShowCancelModal(true);
  }

  async function handleConfirmCancel(event) {
    event.preventDefault();
    if (!cancelReason.trim()) {
      toast.error("A cancellation reason is required.");
      return;
    }

    setSaving(true);
    try {
      await cancelOrder(selectedOrder.id, cancelReason.trim());
      toast.success(`${selectedOrder.order_number} cancelled.`);
      setShowCancelModal(false);
      await loadOrders();
    } catch (error) {
      toast.error(error.message || "Could not cancel this order.");
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteClick(order) {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  }

  async function handleDeleteOrder() {
    setSaving(true);
    try {
      await deleteOrder(selectedOrder.id);
      toast.success(`${selectedOrder.order_number} deleted.`);
      setShowDeleteModal(false);
      await loadOrders();
    } catch (error) {
      toast.error(error.message || "Could not delete this order.");
    } finally {
      setSaving(false);
    }
  }

  return (

    <AdminLayout>

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Orders Management
          </h1>

          <p className="text-gray-500 mt-2">
            Total Orders: {filteredOrders.length}
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          + New Order
        </button>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search order or customer..."
            className="border rounded-lg p-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border rounded-lg p-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >

            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Delivered</option>
            <option>Cancelled</option>

          </select>

        </div>

      </div>

      {/* Orders Table */}

      {loading ? (
        <Loader label="Loading orders..." />
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-4 text-left">Order</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-6 py-4">{order.order_number}</td>
                  <td className="px-6 py-4">{order.customer_name || "—"}</td>
                  <td className="px-6 py-4">KES {Number(order.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(order.status)}`}
                    >
                      {titleCase(order.status)}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <div className="flex gap-2 flex-wrap">

                      <button
                        onClick={() => setViewOrder(order)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        View
                      </button>

                      {order.status === "pending" && (
                        <button
                          onClick={() => handleApprove(order)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}

                      {["pending", "approved"].includes(order.status) && (
                        <button
                          onClick={() => handleCancelClick(order)}
                          className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                        >
                          Cancel
                        </button>
                      )}

                      {order.status === "pending" && (
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

              {filteredOrders.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    No matching orders found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>
      )}

      {/* Create Order Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Create New Order
            </h2>

            <OrderForm
              customers={customers}
              fuels={fuels}
              submitting={saving}
              onSave={handleSaveOrder}
              onCancel={() => setShowModal(false)}
            />

          </div>

        </div>

      )}

      {/* View Order Modal */}

      {viewOrder && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
              {viewOrder.order_number}
            </h2>

            <p className="text-gray-500 mb-4">{viewOrder.customer_name}</p>

            <div className="divide-y border-t border-b mb-4">
              {(viewOrder.items || []).map((item) => (
                <div key={item.id} className="py-2 flex justify-between text-sm">
                  <span>{item.fuel_name} × {item.quantity}</span>
                  <span>KES {Number(item.line_total).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <p className="font-bold text-right mb-6">
              Total: KES {Number(viewOrder.total_amount).toLocaleString()}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setViewOrder(null)}
                className="px-5 py-2 border rounded-lg"
              >
                Close
              </button>
            </div>

          </div>

        </div>

      )}

      {/* Cancel Confirmation Modal */}

      {showCancelModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-xl font-bold mb-4">
              Cancel {selectedOrder?.order_number}
            </h2>

            <form onSubmit={handleConfirmCancel} className="space-y-4">

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation"
                rows={3}
                className="w-full border rounded-lg p-3"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-600 text-white rounded-lg disabled:opacity-60"
                >
                  {saving ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>

            </form>

          </div>

        </div>

      )}

      {/* Delete Confirmation Modal */}

      {showDeleteModal && (

        <ConfirmModal
          title="Delete Order"
          message={`Are you sure you want to delete order ${selectedOrder?.order_number}?`}
          onConfirm={handleDeleteOrder}
          onCancel={() => setShowDeleteModal(false)}
        />

      )}

    </AdminLayout>

  );

}

export default Orders;
