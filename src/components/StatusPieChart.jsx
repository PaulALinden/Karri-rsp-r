import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import "../css/statusPieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusPieChart = ({ jobs }) => {
    const [stats, setStats] = useState({ applied: 0, interview: 0, rejected: 0 });
    const element = window.document.getElementById("root");
    const primaryColor = getComputedStyle(element).getPropertyValue('--color-primary');
    const interviewColor = getComputedStyle(element).getPropertyValue('--color-interview');
    const rejectedColor = getComputedStyle(element).getPropertyValue('--color-rejected');

    useEffect(() => {
        const count = {
            applied: jobs.length,
            interview: jobs.filter(j => j.status === "Intervju").length,
            rejected: jobs.filter(j => j.status === "Avslag").length,
        };
        setStats(count);
    }, [jobs]);

    const data = {
        labels: ['Applications Sent', 'Interviews', 'Rejections'],
        datasets: [
            {
                data: [stats.applied, stats.interview, stats.rejected],
                backgroundColor: [
                    primaryColor,
                    interviewColor,
                    rejectedColor
                ],
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
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
            <Pie data={data} options={options} />
        </div>
    );
};

export default StatusPieChart;
