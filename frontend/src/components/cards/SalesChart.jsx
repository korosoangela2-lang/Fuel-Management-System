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

function SalesChart() {

  const data = {

    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],

    datasets: [

      {
        label: "Fuel Sales",

        data: [
          120,
          240,
          190,
          320,
          410,
          530,
        ],

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

  return <Bar data={data} options={options} />;
}

export default SalesChart;