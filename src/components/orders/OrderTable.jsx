import React, { useEffect, useState, memo } from 'react';
import { FiEye, FiPrinter, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrders,
  changeOrderStatus,
  acceptOrder,
  removeOrder,
  setFilters,
  resetFilters,
  setCurrentOrder,
} from '../../redux/slices/orderSlice';
import OrderStatusBadge from './OrderStatusBadge';
import OrderFilters from './OrderFilters';
import ConfirmOrderModal from './ConfirmOrderModal';
import { formatDate, formatCurrency } from './order.utils';
import { motion } from 'framer-motion';

const OrdersTable = memo(({ onView, onPrint }) => {
  const dispatch = useDispatch();
  const { orders, loading, error, filters, currentOrder } = useSelector(
    (state) => state.orders
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const ordersPerPage = 10;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await dispatch(getOrders(filters)).unwrap();
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load orders');
      }
    };

    loadOrders();
  }, [dispatch, filters]);

  const handleStatusAction = async (order) => {
    try {
      dispatch(setCurrentOrder(order));
      if (order.status === 'placed') {
        setShowConfirmModal(true);
      } else if (order.status === 'accepted') {
        await dispatch(
          changeOrderStatus({ orderId: order.id, status: 'delivered' })
        ).unwrap();
        dispatch(getOrders());
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update order status');
    }
  };

  const handleConfirmOrder = async ({ discount, notes, items }) => {
    try {
      await dispatch(
        acceptOrder({ orderId: currentOrder.id, discount, notes, items })
      ).unwrap();
      setShowConfirmModal(false);
      setErrorMessage('');
      dispatch(getOrders());
    } catch (error) {
      setErrorMessage(error.message || 'Failed to confirm order');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(removeOrder(orderId)).unwrap();
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete order');
      }
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setFilters({ searchTerm: e.target.value }));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    dispatch(setFilters({ status: e.target.value }));
    setCurrentPage(1);
  };

  const handleDateFilterChange = (e) => {
    dispatch(setFilters({ dateFilter: e.target.value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading && !orders.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading orders...
      </div>
    );
  }

  return (
    <>
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-4 rounded"
          role="alert"
        >
          <p>{errorMessage}</p>
        </motion.div>
      )}

      <OrderFilters
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={filters.status}
        onStatusFilterChange={handleStatusFilterChange}
        dateFilter={filters.dateFilter}
        onDateFilterChange={handleDateFilterChange}
        onResetFilters={handleResetFilters}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      #{order.id}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.userId}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {order.shippingAddress}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.orderDate)}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge
                      status={order.status}
                      onActionClick={() => handleStatusAction(order)}
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                      {order.discount > 0 && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                          ({order.discount}% off)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onView(order)}
                        className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                        title="View order"
                        aria-label="View order"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onPrint(order)}
                        className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        title="Print invoice"
                        aria-label="Print invoice"
                      >
                        <FiPrinter className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="Delete order"
                        aria-label="Delete order"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No orders found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {orders.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, orders.length)}
                </span>{' '}
                of <span className="font-medium">{orders.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmOrderModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmOrder}
          order={currentOrder}
          orderItems={currentOrder?.items || []}
        />
      )}
    </>
  );
});

export default OrdersTable;