import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const SalesChart = ({ orders }) => {
  const chartRef = useRef(null);

  // Cleanup chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: orders.length
          ? orders.reduce((acc, order) => {
              const month = new Date(order.orderDate).getMonth();
              acc[month] = (acc[month] || 0) + (order.total || 0);
              return acc;
            }, Array(7).fill(0))
          : [6500, 5900, 8000, 8100, 5600, 5500, 9500],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Orders',
        data: orders.length
          ? orders.reduce((acc, order) => {
              const month = new Date(order.orderDate).getMonth();
              acc[month] = (acc[month] || 0) + 1;
              return acc;
            }, Array(7).fill(0))
          : [4000, 3000, 5000, 3900, 6200, 4500, 7000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">Sales Overview</h3>
        <select className="text-sm border-gray-200 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
      </div>
      <Line ref={chartRef} data={data} options={options} height={300} />
    </div>
  );
};

export default SalesChart;