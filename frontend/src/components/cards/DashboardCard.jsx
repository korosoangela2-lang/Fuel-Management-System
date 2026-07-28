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

            <h1>Administrator Dashboard</h1>

            <div className="cards-grid">

                <DashboardCard
                    title="Fuel Products"
                    value="26"
                    color="#2F80ED"
                    icon={<FaGasPump />}
                />

                <DashboardCard
                    title="Customers"
                    value="187"
                    color="#27AE60"
                    icon={<FaUsers />}
                />

                <DashboardCard
                    title="Orders"
                    value="68"
                    color="#F2994A"
                    icon={<FaClipboardList />}
                />

                <DashboardCard
                    title="Revenue"
                    value="$53,200"
                    color="#EB5757"
                    icon={<FaDollarSign />}
                />

            </div>

        </AdminLayout>
    );
}

export default Dashboard;