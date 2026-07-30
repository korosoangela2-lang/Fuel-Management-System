import UserLayout from "../../layouts/UserLayout";

function OrderHistory() {

  const orders = [

    {
      id: 1001,
      fuel: "Petrol",
      quantity: 500,
      total: 90000,
      status: "Delivered",
      date: "2026-07-18",
    },

    {
      id: 1002,
      fuel: "Diesel",
      quantity: 250,
      total: 42500,
      status: "Pending",
      date: "2026-07-20",
    },

    {
      id: 1003,
      fuel: "Premium Petrol",
      quantity: 800,
      total: 156000,
      status: "Approved",
      date: "2026-07-22",
    },

  ];

  function statusColor(status) {

    switch (status) {

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Approved":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  }

  return (

    <UserLayout>

      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left px-6 py-4">
                Order ID
              </th>

              <th className="text-left px-6 py-4">
                Fuel
              </th>

              <th className="text-left px-6 py-4">
                Quantity
              </th>

              <th className="text-left px-6 py-4">
                Total
              </th>

              <th className="text-left px-6 py-4">
                Date
              </th>

              <th className="text-left px-6 py-4">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t"
              >

                <td className="px-6 py-4">
                  #{order.id}
                </td>

                <td className="px-6 py-4">
                  {order.fuel}
                </td>

                <td className="px-6 py-4">
                  {order.quantity} L
                </td>

                <td className="px-6 py-4">
                  ${order.total.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {order.date}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </UserLayout>

  );

}

export default OrderHistory;