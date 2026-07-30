import UserLayout from "../../layouts/UserLayout";

function DeliveryTracking() {

  const deliveries = [

    {
      id: "DL-1001",
      fuel: "Petrol",
      quantity: 500,
      driver: "Michael Otieno",
      truck: "KDG 458T",
      destination: "Bruce James Warehouse",
      eta: "26 July 2026",
      progress: 85,
      status: "In Transit",
    },

    {
      id: "DL-1002",
      fuel: "Diesel",
      quantity: 250,
      driver: "Peter Mwangi",
      truck: "KCY 611B",
      destination: "Bruce James Station",
      eta: "29 July 2026",
      progress: 40,
      status: "Dispatched",
    },

  ];

  function statusColor(status) {

    switch (status) {

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "In Transit":
        return "bg-blue-100 text-blue-700";

      case "Dispatched":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  }

  return (

    <UserLayout>

      <h1 className="text-3xl font-bold mb-6">
        Delivery Tracking
      </h1>

      <div className="space-y-6">

        {deliveries.map((delivery) => (

          <div
            key={delivery.id}
            className="bg-white rounded-xl shadow p-6"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-xl font-bold">
                  {delivery.id}
                </h2>

                <p className="text-gray-500 mt-1">
                  {delivery.fuel} • {delivery.quantity} Litres
                </p>

              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor(
                  delivery.status
                )}`}
              >
                {delivery.status}
              </span>

            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div>

                <p className="text-gray-500">
                  Driver
                </p>

                <p className="font-semibold">
                  {delivery.driver}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Truck
                </p>

                <p className="font-semibold">
                  {delivery.truck}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Destination
                </p>

                <p className="font-semibold">
                  {delivery.destination}
                </p>

              </div>

              <div>

                <p className="text-gray-500">
                  Estimated Arrival
                </p>

                <p className="font-semibold">
                  {delivery.eta}
                </p>

              </div>

            </div>

            <div className="mt-8">

              <div className="flex justify-between mb-2">

                <span>
                  Delivery Progress
                </span>

                <span>
                  {delivery.progress}%
                </span>

              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                  className="h-3 bg-blue-600 rounded-full"
                  style={{
                    width: `${delivery.progress}%`,
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </UserLayout>

  );

}

export default DeliveryTracking;