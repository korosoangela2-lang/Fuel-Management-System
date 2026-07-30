import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../layouts/AdminLayout";
import Loader from "../../components/common/Loader";
import {
  fetchDistributions,
  scheduleDistribution,
  changeDistributionStatus,
} from "../../services/distributionService";
import { fetchOrders } from "../../services/orderService";

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "in_transit":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

const NEXT_STATUS = {
  pending: ["in_transit", "failed"],
  in_transit: ["delivered", "failed"],
};

function Deliveries() {

  const [statusFilter, setStatusFilter] = useState("All");
  const [deliveries, setDeliveries] = useState([]);
  const [eligibleOrders, setEligibleOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    order_id: "",
    vehicle_registration: "",
    driver_name: "",
    driver_phone: "",
    scheduled_date: "",
    notes: "",
  });

  function loadDeliveries() {
    setLoading(true);
    return fetchDistributions()
      .then((result) => setDeliveries(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load deliveries."))
      .finally(() => setLoading(false));
  }

  function loadEligibleOrders() {
    return fetchOrders({ status: "approved" })
      .then((result) =>
        setEligibleOrders((result.items || []).filter((order) => !order.delivery_status))
      )
      .catch(() => {});
  }

  useEffect(() => {
    void Promise.resolve().then(loadDeliveries);
    loadEligibleOrders();
  }, []);

  const filteredDeliveries = useMemo(() => {
    if (statusFilter === "All") return deliveries;
    return deliveries.filter((delivery) => delivery.status === statusFilter.toLowerCase());
  }, [deliveries, statusFilter]);

  async function handleSchedule(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const selectedOrder = eligibleOrders.find((order) => order.id === Number(form.order_id));
      await scheduleDistribution({
        ...form,
        order_id: Number(form.order_id),
        // A super admin has no region of their own, so the delivery's region
        // is taken from the order being scheduled (other roles are pinned to
        // their own region server-side regardless of this value).
        region_id: selectedOrder?.region_id ?? null,
      });
      toast.success("Delivery scheduled.");
      setShowModal(false);
      setForm({
        order_id: "",
        vehicle_registration: "",
        driver_name: "",
        driver_phone: "",
        scheduled_date: "",
        notes: "",
      });
      await loadDeliveries();
      await loadEligibleOrders();
    } catch (error) {
      toast.error(error.message || "Could not schedule this delivery.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(delivery, status) {
    setSaving(true);
    try {
      await changeDistributionStatus(delivery.id, status);
      toast.success(`${delivery.order_number} marked ${titleCase(status)}.`);
      await loadDeliveries();
    } catch (error) {
      toast.error(error.message || "Could not update delivery status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>

      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Deliveries</h1>
            <p className="text-gray-500 mt-1">Track scheduled deliveries from dispatch to completion.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={eligibleOrders.length === 0}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            title={eligibleOrders.length === 0 ? "No approved orders are awaiting a delivery" : ""}
          >
            + Schedule Delivery
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In_transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <Loader label="Loading deliveries..." />
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No deliveries found.</p>
            ) : (
              filteredDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">{delivery.order_number}</h2>
                      <p className="text-gray-500 mt-1">{delivery.customer_name}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(delivery.status)}`}>
                      {titleCase(delivery.status)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <p className="text-gray-500">Driver</p>
                      <p className="font-semibold">{delivery.driver_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vehicle</p>
                      <p className="font-semibold">{delivery.vehicle_registration}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Scheduled Date</p>
                      <p className="font-semibold">{delivery.scheduled_date}</p>
                    </div>
                  </div>

                  {(NEXT_STATUS[delivery.status] || []).length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {NEXT_STATUS[delivery.status].map((next) => (
                        <button
                          key={next}
                          onClick={() => handleStatusChange(delivery, next)}
                          disabled={saving}
                          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                          Mark {titleCase(next)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Schedule Delivery</h2>

            <form onSubmit={handleSchedule} className="space-y-4">
              <select
                value={form.order_id}
                onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                className="w-full border rounded-lg p-3"
                required
              >
                <option value="" disabled>Select an approved order</option>
                {eligibleOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_number} — {order.customer_name}
                  </option>
                ))}
              </select>

              <input
                value={form.vehicle_registration}
                onChange={(e) => setForm({ ...form, vehicle_registration: e.target.value })}
                placeholder="Vehicle registration"
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                value={form.driver_name}
                onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
                placeholder="Driver name"
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                value={form.driver_phone}
                onChange={(e) => setForm({ ...form, driver_phone: e.target.value })}
                placeholder="Driver phone"
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="date"
                value={form.scheduled_date}
                onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                className="w-full border rounded-lg p-3"
                required
              />

              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes (optional)"
                rows={2}
                className="w-full border rounded-lg p-3"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
                >
                  {saving ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

export default Deliveries;
