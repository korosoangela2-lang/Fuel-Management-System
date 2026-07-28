import {
    Bar
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
            "Jun"
        ],

        datasets: [

            {

                label: "Fuel Sales",

                data: [

                    120,
                    190,
                    300,
                    250,
                    400,
                    500

                ],

            },

        ],

    };

    return <Bar data={data} />;
}

export default SalesChart;