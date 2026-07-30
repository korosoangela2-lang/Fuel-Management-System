import UserLayout from "../../layouts/UserLayout";
import DashboardCard from "../../components/cards/DashboardCard";

import {
  FaGasPump,
  FaClipboardList,
  FaTruck,
  FaClock,
} from "react-icons/fa";

function Dashboard() {
  return (
    <UserLayout>
      <h1 className="text-3xl font-bold mb-6">
        Customer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Available Fuel"
          value="26"
          color="#2F80ED"
          icon={<FaGasPump />}
        />

        <DashboardCard
          title="My Orders"
          value="14"
          color="#27AE60"
          icon={<FaClipboardList />}
        />

        <DashboardCard
          title="Deliveries"
          value="6"
          color="#F2994A"
          icon={<FaTruck />}
        />

        <DashboardCard
          title="Pending"
          value="2"
          color="#EB5757"
          icon={<FaClock />}
        />
      </div>
    </UserLayout>
  );
}

export default Dashboard;