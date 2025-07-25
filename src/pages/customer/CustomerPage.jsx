import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {motion,AnimatePresence } from 'framer-motion';
import { FiSearch, FiUserPlus, FiX } from 'react-icons/fi';
import { getCustomers, getCustomerOrders, setSelectedCustomer, clearCustomerOrders, setFilters, addCustomer, clearError } from './../../redux/slices/customerSlice';

// Lazy load modal
const CustomerOrdersModal = lazy(() => import('./../../components/customers/CustomerOrdersModal'));

// Simplified CustomersTable component
const CustomersTable = React.memo(({ customers, onSelectCustomer }) => (
  <div className="overflow-x-auto rounded-xl shadow-sm">
    <table className="min-w-full bg-white dark:bg-gray-800/80 backdrop-blur-md">
      <thead>
        <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          <th className="p-4 font-medium">Name</th>
          <th className="p-4 font-medium">Email</th>
          <th className="p-4 font-medium">Phone</th>
          <th className="p-4 font-medium">Total Orders</th>
          <th className="p-4 font-medium">Total Spent</th>
          <th className="p-4 font-medium">Last Order</th>
          <th className="p-4 font-medium">Join Date</th>
        </tr>
      </thead>
      <tbody>
        {customers.length === 0 ? (
          <tr>
            <td colSpan="7" className="p-4 text-center text-gray-500 dark:text-gray-400">
              No customers found.
            </td>
          </tr>
        ) : (
          customers.map((customer) => (
            <motion.tr
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              onClick={() => onSelectCustomer(customer)}
            >
              <td className="p-4">{customer.name}</td>
              <td className="p-4">{customer.email}</td>
              <td className="p-4">{customer.phone}</td>
              <td className="p-4">{customer.totalOrders}</td>
              <td className="p-4">${customer.totalSpent.toLocaleString()}</td>
              <td className="p-4">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : '-'}</td>
              <td className="p-4">{new Date(customer.joinDate).toLocaleDateString()}</td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </div>
));

// Add Customer Modal
const AddCustomerModal = React.memo(({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: '', email: '', phone: '' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Customer</h2>
              <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                Add Customer
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const CustomersPage = React.memo(() => {
  const dispatch = useDispatch();
  const { customers, customerOrders, loading, error, filters, selectedCustomer } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setFilters({ searchTerm }));
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, dispatch]);

  // Fetch customers on mount
  useEffect(() => {
    dispatch(getCustomers({ searchTerm }));
  }, [dispatch]);

  // Handle customer selection
  const handleSelectCustomer = useCallback((customer) => {
    dispatch(setSelectedCustomer(customer));
    dispatch(getCustomerOrders(customer.id));
  }, [dispatch]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    dispatch(setSelectedCustomer(null));
    dispatch(clearCustomerOrders());
  }, [dispatch]);

  // Handle search input
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle add customer
  const handleAddCustomer = useCallback(async (customerData) => {
    await dispatch(addCustomer(customerData));
    setIsAddModalOpen(false);
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-3 sm:mt-0">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-all"
            >
              <FiUserPlus className="h-5 w-5" />
              <span>Add Customer</span>
            </motion.button>
          </div>
        </div>

        {/* Error Handling */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex justify-between items-center"
            >
              <span>{error}</span>
              <button onClick={handleClearError} className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100">
                <FiX className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && (
          <CustomersTable
            customers={customers}
            onSelectCustomer={handleSelectCustomer}
          />
        )}

        <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>}>
          <CustomerOrdersModal
            customer={selectedCustomer}
            orders={customerOrders}
            onClose={handleCloseModal}
          />
        </Suspense>

        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCustomer}
        />
      </motion.div>
    </div>
  );
});

export default CustomersPage;