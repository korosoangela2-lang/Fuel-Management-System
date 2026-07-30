function FuelTable() {
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

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Fuel
            </th>

            <th className="px-6 py-4 text-left">
              Price (KES/L)
            </th>

            <th className="px-6 py-4 text-left">
              Stock (L)
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

          {fuels.map((fuel) => (

            <tr
              key={fuel.id}
              className="border-t"
            >

              <td className="px-6 py-4">
                {fuel.name}
              </td>

              <td className="px-6 py-4">
                KES {fuel.price.toFixed(2)}
              </td>

              <td className="px-6 py-4">
                {fuel.stock.toLocaleString()}
              </td>

              <td className="px-6 py-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium

                  ${
                    fuel.status === "Available"
                      ? "bg-green-100 text-green-700"

                      : fuel.status === "Low Stock"
                      ? "bg-yellow-100 text-yellow-700"

                      : "bg-red-100 text-red-700"
                  }
                  `}
                >
                  {fuel.status}
                </span>

              </td>

              <td className="px-6 py-4 text-center space-x-2">

                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default FuelTable;