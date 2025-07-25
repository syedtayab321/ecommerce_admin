import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TrafficSources = ({ orders }) => {
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
    labels: ['Direct', 'Social', 'Referral', 'Organic'],
    datasets: [
      {
        data: [35, 25, 20, 20], // Static data; could be dynamic based on orders
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Traffic Sources</h3>
      <div className="h-64">
        <Pie ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default TrafficSources;