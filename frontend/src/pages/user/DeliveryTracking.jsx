import { useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import { trackOrderDelivery } from "../../services/distributionService";

function statusColor(status) {

  switch (status) {

    case "delivered":
      return "bg-green-100 text-green-700";

    case "in_transit":
      return "bg-indigo-100 text-indigo-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "failed":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";

  }

}

function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function DeliveryTracking() {

  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    if (!orderNumber.trim()) return;

    setSearching(true);
    setSearched(false);
    try {
      const data = await trackOrderDelivery(orderNumber.trim());
      setResult(data);
    } catch (error) {
      setResult(null);
      toast.error(error.message || "Could not find that order.");
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }

  return (

    <UserLayout>

      <h1 className="text-3xl font-bold mb-6">
        Delivery Tracking
      </h1>

      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow p-4 flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter order number, e.g. ORD-00001"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          className="border rounded-lg px-4 py-2 flex-1"
        />

        <button
          type="submit"
          disabled={searching}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg disabled:opacity-60"
        >
          {searching ? "Searching..." : "Track"}
        </button>
      </form>

      {result && (

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center">

            <div>
              <h2 className="text-xl font-bold">{result.order_number}</h2>
              <p className="text-slate-500 mt-1">Order status: {titleCase(result.order_status)}</p>
            </div>

            {result.delivery && (
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(result.delivery.status)}`}>
                {titleCase(result.delivery.status)}
              </span>
            )}

          </div>

          {result.delivery ? (
            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div>
                <p className="text-slate-500">Driver</p>
                <p className="font-semibold">{result.delivery.driver_name}</p>
              </div>

              <div>
                <p className="text-slate-500">Vehicle</p>
                <p className="font-semibold">{result.delivery.vehicle_registration}</p>
              </div>

              <div>
                <p className="text-slate-500">Scheduled Date</p>
                <p className="font-semibold">{result.delivery.scheduled_date}</p>
              </div>

              <div>
                <p className="text-slate-500">
                  {result.delivery.status === "delivered" ? "Delivered At" : "Dispatched At"}
                </p>
                <p className="font-semibold">
                  {(result.delivery.status === "delivered"
                    ? result.delivery.delivered_at
                    : result.delivery.dispatched_at) || "—"}
                </p>
              </div>

            </div>
          ) : (
            <p className="text-slate-500 mt-6">
              No delivery has been scheduled for this order yet.
            </p>
          )}

        </div>

      )}

      {searched && !result && (
        <p className="text-slate-500 text-center py-10">
          No order found with that number.
        </p>
      )}

    </UserLayout>

  );

}

export default DeliveryTracking;
