import React from 'react';
import { Pie } from 'react-chartjs-2';

const TrafficSources = () => {
  const data = {
    labels: ['Direct', 'Social', 'Referral', 'Organic'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)'
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
      <h3 className="font-semibold text-gray-800 mb-4">Traffic Sources</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default TrafficSources;