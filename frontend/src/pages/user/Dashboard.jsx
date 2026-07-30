import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserLayout from "../../layouts/UserLayout";
import DashboardCard from "../../components/cards/DashboardCard";
import Loader from "../../components/common/Loader";
import { fetchDashboardReport } from "../../services/reportService";

import {
  FaGasPump,
  FaClipboardList,
  FaTruck,
  FaClock,
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardReport()
      .then(setStats)
      .catch((error) => toast.error(error.message || "Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <UserLayout>
        <Loader label="Loading dashboard..." />
      </UserLayout>
    );
  }

  const deliveriesInFlight = Object.values(stats?.deliveries || {}).reduce(
    (sum, count) => sum + Number(count || 0),
    0
  );

  return (
    <UserLayout>
      <h1 className="text-3xl font-bold mb-6">
        Customer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Fuel Products"
          value={stats?.inventory?.product_count ?? 0}
          color="#2F80ED"
          icon={<FaGasPump />}
        />

        <DashboardCard
          title="Recent Orders"
          value={stats?.my_recent_orders?.length ?? 0}
          color="#27AE60"
          icon={<FaClipboardList />}
        />

        <DashboardCard
          title="Deliveries"
          value={deliveriesInFlight}
          color="#F2994A"
          icon={<FaTruck />}
        />

        <DashboardCard
          title="Pending Orders"
          value={stats?.pending_orders ?? 0}
          color="#EB5757"
          icon={<FaClock />}
        />
      </div>
    </UserLayout>
  );
}

export default Dashboard;
