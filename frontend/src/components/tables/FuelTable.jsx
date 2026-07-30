function statusFor(fuel) {
  if (!fuel.is_active) return "Inactive";
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
    case "Inactive":
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    default:
      return "bg-red-500/10 text-red-400 border border-red-500/20";
  }
}

function FuelTable({
  fuels,
  onEdit,
  onAddStock,
  onDeactivate,
}) {
  return (
    <div className="bg-slate-900 rounded-xl shadow overflow-hidden">

      <table className="min-w-full">

        <thead className="bg-slate-800">

          <tr>

            <th className="px-6 py-4 text-left">
              Fuel
            </th>

            <th className="px-6 py-4 text-left">
              Price
            </th>

            <th className="px-6 py-4 text-left">
              Stock
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {fuels.length === 0 ? (

            <tr>

              <td
                colSpan="5"
                className="text-center py-10 text-slate-400"
              >
                No fuel products found.
              </td>

            </tr>

          ) : (

            fuels.map((fuel) => (

              <tr
                key={fuel.id}
                className="border-t border-slate-800"
              >

                <td className="px-6 py-4">
                  {fuel.name}
                  <div className="text-xs text-slate-500">{fuel.fuel_type}</div>
                </td>

                <td className="px-6 py-4">
                  KES {Number(fuel.unit_price).toFixed(2)} / {fuel.unit_of_measure}
                </td>

                <td className="px-6 py-4">
                  {Number(fuel.quantity_available).toLocaleString()} {fuel.unit_of_measure}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(statusFor(fuel))}`}
                  >
                    {statusFor(fuel)}
                  </span>

                </td>

                <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">

                  <button
                    onClick={() => onEdit(fuel)}
                    className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onAddStock(fuel)}
                    className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700"
                  >
                    Add Stock
                  </button>

                  <button
                    onClick={() => onDeactivate(fuel)}
                    disabled={!fuel.is_active}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Deactivate
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default FuelTable;
