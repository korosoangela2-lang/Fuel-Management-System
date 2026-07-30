function RecentOrders() {

  const orders = [

    {
      customer: "ABC Ltd",
      fuel: "Diesel",
      status: "Delivered",
    },

    {
      customer: "City Haulers",
      fuel: "Petrol",
      status: "Pending",
    },

    {
      customer: "Green Energy",
      fuel: "Kerosene",
      status: "Processing",
    },

  ];

  return (

    <div className="space-y-4">

      {orders.map((order, index) => (

        <div
          key={index}
          className="border-b pb-3"
        >

          <h3 className="font-semibold">
            {order.customer}
          </h3>

          <p className="text-gray-500 text-sm">
            {order.fuel}
          </p>

          <span className="text-blue-600 text-sm">
            {order.status}
          </span>

        </div>

      ))}

    </div>

  );
}

export default RecentOrders;