import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';

const CategoryFilters = ({ filters, setFilters, loading }) => {
  const debouncedSetFilters = debounce((value) => {
    setFilters({ search: value });
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSetFilters(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <label htmlFor="search" className="sr-only">
            Search categories
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              disabled={loading}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
              placeholder="Search categories..."
              aria-label="Search categories"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryFilters;