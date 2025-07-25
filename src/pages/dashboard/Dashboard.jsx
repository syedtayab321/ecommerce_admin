import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrendingUp, FiDollarSign, FiUsers, FiPackage, FiFilter } from 'react-icons/fi';
import { getOrders, setFilters, resetFilters, changeOrderStatus, removeOrder } from './../../redux/slices/orderSlice';
import { motion } from 'framer-motion';

// Lazy load components
const SalesChart = lazy(() => import('./../../components/Dashboard/SalesChart'));
const TrafficSources = lazy(() => import('./../../components/Dashboard/TrafficSources'));
const TopProducts = lazy(() => import('./../../components/Dashboard/TopProducts'));
const MetricCard = lazy(() => import('./../../components/Dashboard/MetricsCard'));
const RecentOrders = lazy(() => import('./../../components/Dashboard/RecentOrders'));

const Dashboard = React.memo(() => {
  const dispatch = useDispatch();
  const { orders, loading, error, filters } = useSelector((state) => state.orders);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch orders on mount and when filters change
  useEffect(() => {
    dispatch(getOrders(filters));
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(setFilters({ [name]: value }));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Handle order status update
  const handleUpdateStatus = useCallback(
    (orderId, status) => {
      dispatch(changeOrderStatus({ orderId, status }));
    },
    [dispatch]
  );

  // Handle order deletion
  const handleDelete = useCallback(
    (orderId) => {
      dispatch(removeOrder(orderId));
    },
    [dispatch]
  );

  // Calculate metrics dynamically
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const newCustomers = new Set(orders.map((order) => order.userId)).size;
    const conversionRate = totalOrders > 0 ? ((totalOrders / (newCustomers || 1)) * 100).toFixed(2) : '0.00';

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: '12.5%',
        isIncrease: true,
        icon: <FiDollarSign className="text-blue-500" />,
      },
      {
        title: 'Total Orders',
        value: totalOrders.toLocaleString(),
        change: '8.3%',
        isIncrease: true,
        icon: <FiPackage className="text-green-500" />,
      },
      {
        title: 'New Customers',
        value: newCustomers.toLocaleString(),
        change: '-2.1%',
        isIncrease: false,
        icon: <FiUsers className="text-purple-500" />,
      },
      {
        title: 'Conversion Rate',
        value: `${conversionRate}%`,
        change: '0.7%',
        isIncrease: true,
        icon: <FiTrendingUp className="text-amber-500" />,
      },
    ];
  }, [orders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-all"
          >
            <FiFilter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 mb-6 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                <input
                  name="searchTerm"
                  value={filters.searchTerm || ''}
                  onChange={handleFilterChange}
                  placeholder="Search by user ID"
                  className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  name="status"
                  value={filters.status || 'all'}
                  onChange={handleFilterChange}
                  className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <select
                  name="dateFilter"
                  value={filters.dateFilter || 'all'}
                  onChange={handleFilterChange}
                  className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleResetFilters}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Error Handling */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <Suspense key={index} fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>}>
                  <MetricCard {...metric} />
                </Suspense>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
                  <SalesChart orders={orders} />
                </Suspense>
              </div>
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
                  <TrafficSources orders={orders} />
                </Suspense>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
                  <RecentOrders orders={orders} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
                </Suspense>
              </div>
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-sm">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
                  <TopProducts orders={orders} />
                </Suspense>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
});

export default Dashboard;