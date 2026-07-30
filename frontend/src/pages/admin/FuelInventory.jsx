import AdminLayout from "../../layouts/AdminLayout";

import FuelTable from "../../components/tables/FuelTable";

function FuelInventory() {
  return (
    <AdminLayout>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Fuel Inventory
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all fuel products in the system.
            </p>

          </div>

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Fuel
          </button>

        </div>

        {/* Fuel Table */}

        <FuelTable />

      </div>

    </AdminLayout>
  );
}

export default FuelInventory;