import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import Loader from "../../components/common/Loader";
import { fetchFuels } from "../../services/fuelService";
import { fetchCustomers } from "../../services/customerService";
import { createOrder } from "../../services/orderService";

function FuelOrders() {
  const [fuels, setFuels] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Stores the selected fuel for checkout
  const [selectedFuel, setSelectedFuel] = useState(null);

  // Stores the quantity entered
  const [quantity, setQuantity] = useState("");

  // Selected customer to place the order on behalf of
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    Promise.all([fetchFuels(), fetchCustomers({ is_active: true })])
      .then(([fuelResult, customerResult]) => {
        setFuels(fuelResult.items || []);
        setCustomers(customerResult.items || []);
      })
      .catch((error) => toast.error(error.message || "Could not load order data."))
      .finally(() => setLoading(false));
  }, []);

  // Opens the checkout modal
  function checkout(fuel) {
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (Number(quantity) > Number(fuel.quantity_available)) {
      toast.error("That quantity exceeds available stock.");
      return;
    }

    setSelectedFuel(fuel);
  }

  // Confirms the order
  async function confirmOrder() {
    if (!customerId) {
      toast.error("Please select a customer for this order.");
      return;
    }

    setPlacingOrder(true);
    try {
      await createOrder({
        customer_id: Number(customerId),
        items: [{ fuel_id: selectedFuel.id, quantity }],
      });

      toast.success(
        `${quantity}${selectedFuel.unit_of_measure} of ${selectedFuel.name} has been ordered successfully.`
      );

      setSelectedFuel(null);
      setQuantity("");
    } catch (error) {
      toast.error(error.message || "Could not place the order.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <UserLayout>
        <Loader label="Loading fuel orders..." />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">
        Fuel Orders
      </h1>

      {/* Fuel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {fuels.map((fuel) => (
          <div
            key={fuel.id}
            className="bg-white rounded-xl shadow p-6"
          >
            {/* Fuel Name */}
            <h2 className="text-xl font-bold">
              {fuel.name}
            </h2>

            {/* Price */}
            <p className="mt-4 text-slate-500">
              Price
            </p>

            <p className="font-semibold">
              KES {Number(fuel.unit_price).toFixed(2)} / {fuel.unit_of_measure}
            </p>

            {/* Stock */}
            <p className="mt-4 text-slate-500">
              Available Stock
            </p>

            <p className="font-semibold">
              {Number(fuel.quantity_available).toLocaleString()} {fuel.unit_of_measure}
            </p>

            {/* Quantity */}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Enter Quantity (${fuel.unit_of_measure})`}
              className="mt-5 w-full border rounded-lg p-3"
            />

            {/* Estimated Total */}
            <div className="mt-5">
              <p className="text-sm text-slate-500">
                Estimated Total
              </p>

              <h3 className="text-2xl font-bold">
                KES{" "}
                {quantity
                  ? (
                      Number(quantity) * Number(fuel.unit_price)
                    ).toLocaleString()
                  : 0}
              </h3>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => checkout(fuel)}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition"
            >
              Checkout
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {selectedFuel && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[420px] p-8">
            <h2 className="text-2xl font-bold mb-6">
              Confirm Order
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-sm">Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="" disabled>Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <p>
                <strong>Fuel:</strong>{" "}
                {selectedFuel.name}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {quantity} {selectedFuel.unit_of_measure}
              </p>

              <p>
                <strong>Total:</strong> KES{" "}
                {(
                  Number(quantity) *
                  Number(selectedFuel.unit_price)
                ).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setSelectedFuel(null)}
                disabled={placingOrder}
                className="px-5 py-2 border rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmOrder}
                disabled={placingOrder}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60"
              >
                {placingOrder ? "Placing order..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default FuelOrders;
