function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status) {
  switch (status) {
    case "delivered":
      return "text-green-600";
    case "approved":
      return "text-indigo-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-yellow-600";
  }
}

function RecentOrders({ orders = [] }) {

  if (orders.length === 0) {
    return <p className="text-slate-500 text-sm">No recent orders yet.</p>;
  }

  return (

    <div className="space-y-4">

      {orders.map((order) => (

        <div
          key={order.id}
          className="border-b pb-3"
        >

          <h3 className="font-semibold">
            {order.customer || order.order_number}
          </h3>

          <p className="text-slate-500 text-sm">
            {order.order_number}
          </p>

          <span className={`text-sm ${statusColor(order.status)}`}>
            {titleCase(order.status)}
          </span>

        </div>

      ))}

    </div>

  );
}

export default RecentOrders;
