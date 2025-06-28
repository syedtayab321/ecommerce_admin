import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const MetricCard = ({ title, value, change, isIncrease, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
        <div className="p-2 rounded-lg bg-opacity-20 bg-blue-100">
          {icon}
        </div>
      </div>
      <div className={`flex items-center mt-4 text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
        {isIncrease ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
        <span>{change}</span>
        <span className="text-gray-500 ml-1">vs last month</span>
      </div>
    </div>
  );
};

export default MetricCard;