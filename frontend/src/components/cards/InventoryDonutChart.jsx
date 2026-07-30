import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ["#f59e0b", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#14b8a6"];

function InventoryDonutChart({ products = [] }) {
  const byType = products.reduce((acc, product) => {
    const key = product.fuel_type || product.name || "Other";
    acc[key] = (acc[key] || 0) + Number(product.quantity_available || 0);
    return acc;
  }, {});

  const labels = Object.keys(byType);
  const values = Object.values(byType);
  const total = values.reduce((sum, v) => sum + v, 0);

  if (labels.length === 0) {
    return <p className="text-slate-500 text-sm text-center py-10">No inventory data yet.</p>;
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: PALETTE,
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "72%",
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="flex items-center gap-6">

      <div className="relative w-40 h-40 shrink-0">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono text-white">{total.toLocaleString()}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Total</span>
        </div>
      </div>

      <div className="space-y-2 flex-1 min-w-0">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-300 capitalize truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              />
              {label}
            </span>
            <span className="font-mono text-slate-400 shrink-0 ml-2">
              {values[i].toLocaleString()}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default InventoryDonutChart;
