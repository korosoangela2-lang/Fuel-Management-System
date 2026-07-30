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

  const [quantities, setQuantities] = useState({});

  function updateQuantity(id, value) {

    setQuantities({
      ...quantities,
      [id]: value,
    });

  }

  function placeOrder(fuel) {

    const quantity = quantities[fuel.id];

    if (!quantity || quantity <= 0) {

      toast.error("Enter a valid quantity.");

      return;

    }

    toast.success(
      `Order placed successfully for ${quantity}L of ${fuel.name}.`
    );

  }

  return (

    <UserLayout>

      <h1 className="text-3xl font-bold mb-6">
        Fuel Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {fuels.map((fuel) => (

          <div
            key={fuel.id}
            className="bg-white rounded-xl shadow p-6"
          >

            <h2 className="text-xl font-bold">
              {fuel.name}
            </h2>

            <p className="mt-3 text-gray-500">
              Price
            </p>

            <p className="font-semibold">
              ${fuel.price} / L
            </p>

            <p className="mt-3 text-gray-500">
              Available Stock
            </p>

            <p className="font-semibold">
              {fuel.stock} Litres
            </p>

            <input
              type="number"
              min="1"
              placeholder="Quantity (Litres)"
              className="mt-5 w-full border rounded-lg p-3"
              onChange={(e) =>
                updateQuantity(
                  fuel.id,
                  e.target.value
                )
              }
            />

            <button
              onClick={() => placeOrder(fuel)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              Place Order
            </button>

          </div>

        ))}

      </div>

    </UserLayout>

  );

}

export default FuelOrders;