import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import "../css/statusPieChart.css";
import { useLanguage } from "./context/LanguageContext"; // Importera språk-kontexten
import statusPieChartTranslations from "../utils/language/status-pie-chart.json"; // Importera översättningar

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ jobs }) => {
    const [stats, setStats] = useState({ applied: 3, interview: 3, rejected: 3 });
    const element = window.document.getElementById("root");
    const primaryColor = getComputedStyle(element).getPropertyValue(
        "--color-primary"
    );
    const interviewColor = getComputedStyle(element).getPropertyValue(
        "--color-interview"
    );
    const rejectedColor = getComputedStyle(element).getPropertyValue(
        "--color-rejected"
    );
    const { language } = useLanguage();
    const t = statusPieChartTranslations[language].statusPieChart; // Hämta översättningar

    useEffect(() => {
        const count = {
            applied: jobs.filter((j) => j.status === "Applied").length,
            interview: jobs.filter((j) => j.status === "Interview").length,
            rejected: jobs.filter((j) => j.status === "Rejected").length,
        };
        setStats(count);
    }, [jobs]);

    // Översätt etiketterna baserat på språk
    const translatedLabels = ["Ansökt", "Intervju", "Avslag"].map(
        (label) => t.labels[label]
    );

    const data = {
        labels: translatedLabels,
        datasets: [
            {
                data: [stats.applied, stats.interview, stats.rejected],
                backgroundColor: [primaryColor, interviewColor, rejectedColor],
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: "bottom",
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = data.datasets[0].data[tooltipItem.dataIndex];
                        const label = data.labels[tooltipItem.dataIndex];
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    return (
        <div className="chart-container">
            <h5>
                {t.title}
                {jobs.length}
            </h5>
            <Pie data={data} options={options} />
        </div>
    );
};

export default StatusPieChart;
