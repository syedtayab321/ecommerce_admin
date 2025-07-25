import React, { useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Lazy load components
const OrdersTable = lazy(() => import('../../components/orders/OrderTable'));
const OrderDetailsModal = lazy(() => import('../../components/orders/OrderDetailsModal'));

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePrint = async (order) => {
    try {
      // Assuming generateInvoicePDF is implemented elsewhere
      await import('../../components/orders/InvoiceGenerator').then((module) =>
        module.generateInvoicePDF(order)
      );
      toast.success('Invoice generated successfully!', { autoClose: 3000 });
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to generate invoice. Please try again.', { autoClose: 3000 });
    }
  };

  const handleRefresh = () => {
    dispatch(getOrders());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Order Management
          </h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Refreshing...
              </span>
            ) : (
              'Refresh Orders'
            )}
          </button>
        </div>
        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
          }
        >
          <OrdersTable onView={handleView} onPrint={handlePrint} />
        </Suspense>
        <Suspense fallback={null}>
          {isModalOpen && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Suspense>
      </div>
    </motion.div>
  );
};

export default OrdersPage;