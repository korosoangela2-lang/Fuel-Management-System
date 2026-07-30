function titleCase(value = "") {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusColor(status) {
  switch (status) {
    case "delivered":
      return "text-green-400";
    case "approved":
      return "text-blue-400";
    case "cancelled":
      return "text-red-400";
    default:
      return "text-yellow-400";
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
          className="border-b border-slate-800 pb-3"
        >

          <h3 className="font-semibold text-white">
            {order.customer || order.order_number}
          </h3>

          <p className="text-slate-500 text-sm font-mono">
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
