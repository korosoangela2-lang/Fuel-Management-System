import {
  Bar,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SalesChart({ labels = [], values = [], label = "Revenue (KES)" }) {

  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: labels.map((_, i) =>
          i === labels.length - 1 ? "#f59e0b" : "#78450f"
        ),
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { family: "JetBrains Mono", size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b", font: { family: "JetBrains Mono", size: 11 } },
        grid: { color: "#1e293b" },
      },
    },
  };

  if (labels.length === 0) {
    return <p className="text-slate-500 text-center py-10">Not enough data yet to chart revenue.</p>;
  }

  return <Bar data={data} options={options} />;
}

export default SalesChart;
