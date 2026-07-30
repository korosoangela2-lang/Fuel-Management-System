import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import Loader from "../../components/common/Loader";
import { fetchFuels } from "../../services/fuelService";

function statusFor(fuel) {
  if (Number(fuel.quantity_available) <= 0) return "Out of Stock";
  if (fuel.is_low_stock) return "Low Stock";
  return "Available";
}

function statusColor(status) {
  switch (status) {
    case "Available":
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    case "Low Stock":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    default:
      return "bg-red-500/10 text-red-400 border border-red-500/20";
  }
}

function AvailableFuel() {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [fuels, setFuels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFuels({ per_page: 100 })
      .then((result) => setFuels(result.items || []))
      .catch((error) => toast.error(error.message || "Could not load fuel inventory."))
      .finally(() => setLoading(false));
  }, []);

  const filteredFuels = useMemo(() => {

    return fuels.filter((fuel) => {

      const matchesSearch = fuel.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const fuelStatus = statusFor(fuel);
      const matchesStatus =
        status === "All"
          ? true
          : fuelStatus === status;

      return matchesSearch && matchesStatus;

    });

  }, [fuels, search, status]);

  return (

    <UserLayout>

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Available Fuel</h1>
          <p className="text-slate-400 mt-1">
            Current fuel products and stock levels in your region.
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search fuel..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border border-slate-700 rounded-lg px-4 py-2 flex-1"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="border border-slate-700 rounded-lg px-4 py-2"
          >
            <option>All</option>
            <option>Available</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {loading ? (
          <Loader label="Loading fuel inventory..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredFuels.length === 0 ? (
              <p className="text-slate-400 col-span-full text-center py-10">
                No fuel products match your search.
              </p>
            ) : (
              filteredFuels.map((fuel) => (
                <div key={fuel.id} className="bg-slate-900 rounded-xl shadow p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold">{fuel.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(statusFor(fuel))}`}>
                      {statusFor(fuel)}
                    </span>
                  </div>

                  <p className="mt-4 text-slate-400">Price</p>
                  <p className="font-semibold">
                    KES {Number(fuel.unit_price).toFixed(2)} / {fuel.unit_of_measure}
                  </p>

                  <p className="mt-4 text-slate-400">Available Stock</p>
                  <p className="font-semibold">
                    {Number(fuel.quantity_available).toLocaleString()} {fuel.unit_of_measure}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>

    </UserLayout>

  );
}

export default AvailableFuel;
