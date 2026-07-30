import { useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";

function FuelOrders() {
  const fuels = [
    {
      id: 1,
      name: "Petrol",
      price: 180,
      stock: 9500,
    },
    {
      id: 2,
      name: "Diesel",
      price: 170,
      stock: 7200,
    },
    {
      id: 3,
      name: "Kerosene",
      price: 155,
      stock: 3100,
    },
    {
      id: 4,
      name: "Premium Petrol",
      price: 195,
      stock: 4600,
    },
  ];

  // Stores the selected fuel for checkout
  const [selectedFuel, setSelectedFuel] = useState(null);

  // Stores the quantity entered
  const [quantity, setQuantity] = useState("");

  // Opens the checkout modal
  function checkout(fuel) {
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    setSelectedFuel(fuel);
  }

  // Confirms the order
  function confirmOrder() {
    toast.success(
      `${quantity}L of ${selectedFuel.name} has been ordered successfully.`
    );

    // Reset the form
    setSelectedFuel(null);
    setQuantity("");
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
            <p className="mt-4 text-gray-500">
              Price
            </p>

            <p className="font-semibold">
              ${fuel.price} / L
            </p>

            {/* Stock */}
            <p className="mt-4 text-gray-500">
              Available Stock
            </p>

            <p className="font-semibold">
              {fuel.stock.toLocaleString()} Litres
            </p>

            {/* Quantity */}
            <input
              type="number"
              min="1"
              value={
                selectedFuel?.id === fuel.id
                  ? quantity
                  : quantity
              }
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder="Enter Quantity (Litres)"
              className="mt-5 w-full border rounded-lg p-3"
            />

            {/* Estimated Total */}
            <div className="mt-5">
              <p className="text-sm text-gray-500">
                Estimated Total
              </p>

              <h3 className="text-2xl font-bold">
                $
                {quantity
                  ? (
                      Number(quantity) * fuel.price
                    ).toLocaleString()
                  : 0}
              </h3>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => checkout(fuel)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
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

            <div className="space-y-3">
              <p>
                <strong>Customer:</strong>{" "}
                Bruce James
              </p>

              <p>
                <strong>Fuel:</strong>{" "}
                {selectedFuel.name}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {quantity} Litres
              </p>

              <p>
                <strong>Total:</strong> $
                {(
                  Number(quantity) *
                  selectedFuel.price
                ).toLocaleString()}
              </p>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() =>
                  setSelectedFuel(null)
                }
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmOrder}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default FuelOrders;