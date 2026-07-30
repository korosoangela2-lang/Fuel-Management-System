function FuelCard({
  fuel,
  onOrder,
}) {

  const statusColors = {
    Available: "bg-green-100 text-green-700",
    "Low Stock": "bg-yellow-100 text-yellow-700",
    "Out of Stock": "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">

      <div>

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            {fuel.name}
          </h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[fuel.status]
            }`}
          >
            {fuel.status}
          </span>

        </div>

        <p className="text-slate-500 mt-4">
          Price
        </p>

        <p className="text-3xl font-bold">
          ${fuel.price}
          <span className="text-base font-normal">
            /L
          </span>
        </p>

        <p className="mt-3 text-slate-600">
          Stock:{" "}
          <strong>
            {fuel.stock.toLocaleString()} Litres
          </strong>
        </p>

      </div>

      <button
        disabled={fuel.status === "Out of Stock"}
        onClick={() => onOrder(fuel)}
        className={`mt-6 py-3 rounded-lg font-semibold transition ${
          fuel.status === "Out of Stock"
            ? "bg-slate-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
      >
        {fuel.status === "Out of Stock"
          ? "Unavailable"
          : "Order Fuel"}
      </button>

    </div>
  );
}

export default FuelCard;