import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onResetFilters,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700 dark:text-gray-200 flex items-center">
          <FiFilter className="mr-2" /> Filters
        </h3>
        <button
          onClick={onResetFilters}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
        >
          <FiX className="mr-1" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search by order ID or customer..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Search orders"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="accepted">Accepted</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Range
          </label>
          <select
            value={dateFilter}
            onChange={onDateFilterChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Filter by date range"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderFilters;