import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MetricCard = React.memo(({ title, value, change, isIncrease, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm flex items-center space-x-4"
  >
    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
      <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
      <p className={`text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
        {isIncrease ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
        {change} <span className="text-gray-500">vs last month</span>
      </p>
    </div>
  </motion.div>
));

export default MetricCard;