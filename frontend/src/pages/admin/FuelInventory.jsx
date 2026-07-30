import { useMemo, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import FuelTable from "../../components/tables/FuelTable";

function FuelInventory() {

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

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
        statusFilter === "All"
          ? true
          : fuel.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [search, statusFilter]);

  return (

    <AdminLayout>

      <div className="space-y-6">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Fuel Inventory
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all fuel products.
            </p>

          </div>

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Fuel
          </button>

        </div>

        {/* Search + Filter */}

        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Search fuel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 flex-1"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >

            <option>
              All
            </option>

            <option>
              Available
            </option>

            <option>
              Low Stock
            </option>

            <option>
              Out of Stock
            </option>

          </select>

        </div>

        <FuelTable
          fuels={filteredFuels}
        />

      </div>

    </AdminLayout>

  );
}

export default FuelInventory;