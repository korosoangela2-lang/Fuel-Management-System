import AdminLayout from "../../layouts/AdminLayout";
import DashboardCard from "../../components/cards/DashboardCard";

import {
  FaGasPump,
  FaUsers,
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";

function Dashboard() {
  return (
    <AdminLayout>

      <h1 className="text-3xl font-bold mb-8">
        Administrator Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Fuel Products"
          value="26"
          color="bg-blue-600"
          icon={<FaGasPump />}
        />

        <DashboardCard
          title="Customers"
          value="187"
          color="bg-green-600"
          icon={<FaUsers />}
        />

        <DashboardCard
          title="Orders"
          value="68"
          color="bg-yellow-500"
          icon={<FaClipboardList />}
        />

        <DashboardCard
          title="Revenue"
          value="$53,200"
          color="bg-red-600"
          icon={<FaDollarSign />}
        />

      </div>

    </AdminLayout>
  );
}

export default Dashboard;