import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

type Props = {
    data: {
        dia: string;
        usuarios: number;
    }[];
};

export default function LineChart({
    data,
}: Props) {

    const chartData = {

        labels: data.map((x) => x.dia),

        datasets: [
            {
                label: "Usuarios",

                data: data.map((x) => x.usuarios),

                borderColor: "rgb(118, 246, 59)",

                backgroundColor:
                    "rgba(59, 130, 246, 0.5)",

                tension: 0.4,

                fill: true,
            },
        ],
    };

    return (
        <Line data={chartData} />
    );
}