import AdminLayout from "../../layouts/AdminLayout";

function Orders() {

  const orders = [

    {
      id: "ORD-1001",
      customer: "Bruce James",
      fuel: "Petrol",
      quantity: 500,
      total: 90000,
      status: "Pending",
    },

    {
      id: "ORD-1002",
      customer: "Acme Logistics",
      fuel: "Diesel",
      quantity: 1200,
      total: 204000,
      status: "Approved",
    },

    {
      id: "ORD-1003",
      customer: "City Transport",
      fuel: "Premium Petrol",
      quantity: 750,
      total: 146250,
      status: "Delivered",
    },

  ];

  function badgeColor(status) {

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

    <AdminLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Orders Management
        </h1>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          New Order
        </button>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Order ID
              </th>

              <th className="px-6 py-4 text-left">
                Customer
              </th>

              <th className="px-6 py-4 text-left">
                Fuel
              </th>

              <th className="px-6 py-4 text-left">
                Quantity
              </th>

              <th className="px-6 py-4 text-left">
                Total
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Actions
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
                  {order.id}
                </td>

                <td className="px-6 py-4">
                  {order.customer}
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

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor(order.status)}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex gap-2">

                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>

  );

}

export default Orders;