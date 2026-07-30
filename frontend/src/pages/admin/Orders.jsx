import { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

function Orders() {

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    fuel: "Petrol",
    quantity: "",
    status: "Pending",
  });

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

    {
      id: "ORD-1004",
      customer: "Bruce James",
      fuel: "Diesel",
      quantity: 300,
      total: 51000,
      status: "Delivered",
    },

    {
      id: "ORD-1005",
      customer: "National Energy",
      fuel: "Kerosene",
      quantity: 1000,
      total: 98000,
      status: "Pending",
    },
  ];

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const matchesSearch =

        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||

        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||

        order.fuel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [orders, searchTerm, statusFilter]);

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

  function handleChange(e) {

    const { name, value } = e.target;

    setNewOrder({

      ...newOrder,

      [name]: value,

    });

  }

  function handleSubmit(e) {

    e.preventDefault();

    console.log(newOrder);

    setShowModal(false);

    setNewOrder({

      customer: "",

      fuel: "Petrol",

      quantity: "",

      status: "Pending",

    });

  }

  return (

    <AdminLayout>

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Orders Management
          </h1>

          <p className="text-gray-500 mt-2">
            Total Orders: {filteredOrders.length}
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          + New Order
        </button>

      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg p-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border rounded-lg p-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Delivered</option>
          </select>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">Order ID</th>

              <th className="px-6 py-4 text-left">Customer</th>

              <th className="px-6 py-4 text-left">Fuel</th>

              <th className="px-6 py-4 text-left">Quantity</th>

              <th className="px-6 py-4 text-left">Total</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">{order.id}</td>

                <td className="px-6 py-4">{order.customer}</td>

                <td className="px-6 py-4">{order.fuel}</td>

                <td className="px-6 py-4">{order.quantity} L</td>

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

                    <button className="bg-blue-600 text-white px-3 py-1 rounded">
                      View
                    </button>

                    <button className="bg-green-600 text-white px-3 py-1 rounded">
                      Edit
                    </button>

                    <button className="bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Create New Order
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                name="customer"
                value={newOrder.customer}
                onChange={handleChange}
                placeholder="Customer Name"
                className="border rounded-lg p-3 w-full"
                required
              />

              <select
                name="fuel"
                value={newOrder.fuel}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Premium Petrol</option>
                <option>Kerosene</option>
              </select>

              <input
                name="quantity"
                type="number"
                value={newOrder.quantity}
                onChange={handleChange}
                placeholder="Quantity (Litres)"
                className="border rounded-lg p-3 w-full"
                required
              />

              <select
                name="status"
                value={newOrder.status}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full"
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>Delivered</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Save Order
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </AdminLayout>

  );

}

export default Orders;