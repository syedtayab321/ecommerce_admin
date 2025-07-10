import React from 'react';

const CategoryFilters = ({ filters, setFilters, loading }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              disabled={loading}
              className="block w-full rounded-md border-gray-300 pl-4 pr-12 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search categories..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;