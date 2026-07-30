import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import FuelCard from "../../components/cards/FuelCard";

function AvailableFuel() {

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const fuels = [
    {
      id: 1,
      name: "Petrol",
      price: 182.45,
      stock: 12500,
      status: "Available",
    },
    {
      id: 2,
      name: "Diesel",
      price: 171.30,
      stock: 9800,
      status: "Available",
    },
    {
      id: 3,
      name: "Kerosene",
      price: 145.20,
      stock: 3500,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Jet Fuel",
      price: 210.00,
      stock: 0,
      status: "Out of Stock",
    },
  ];

  const filteredFuels = useMemo(() => {

    return fuels.filter((fuel) => {

      const matchesSearch = fuel.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "All"
          ? true
          : fuel.status === status;

      return matchesSearch && matchesStatus;

    });

  }, [search, status]);

  function handleOrder(fuel) {

    toast.success(
      `${fuel.name} selected for ordering.`
    );

  }

  return (

    <UserLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold">
            Available Fuel
          </h1>

          <p className="text-gray-500 mt-1">
            Browse available fuel products.
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search fuel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 flex-1"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option>All</option>
            <option>Available</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredFuels.map((fuel) => (

            <FuelCard
              key={fuel.id}
              fuel={fuel}
              onOrder={handleOrder}
            />

          ))}

        </div>

      </div>

    </UserLayout>

  );
}

export default AvailableFuel;