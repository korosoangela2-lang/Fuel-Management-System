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
        backgroundColor: "#2563EB",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (labels.length === 0) {
    return <p className="text-slate-500 text-center py-10">Not enough data yet to chart revenue.</p>;
  }

  return <Bar data={data} options={options} />;
}

export default SalesChart;
