import React from 'react';
import { formatDate, formatCurrency } from './order.utils';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                  Order #{order.id}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Customer Information
                </h3>
                <p className="text-gray-900 dark:text-gray-100">
                  User ID: {order.userId}
                </p>
                <p className="text-gray-900 dark:text-gray-100">
                  Shipping Address: {order.shippingAddress}
                </p>
                <p className="text-gray-900 dark:text-gray-100">
                  Payment Method: {order.paymentMethod}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Order Summary
                </h3>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-300">Items:</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {order.items?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between mt-1 text-green-600 dark:text-green-400">
                    <span>Discount ({order.discount}%):</span>
                    <span>
                      -{formatCurrency(order.totalAmount * (order.discount / 100))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Total:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {formatCurrency(
                      order.totalAmount - (order.totalAmount * (order.discount / 100 || 0))
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
                Order Items
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {order.items?.map((item, index) => (
                      <tr
                        key={`${item.productId}-${index}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.imageUrl && (
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded"
                                  src={item.imageUrl}
                                  alt={item.name}
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.color && <span>Color: {item.color}</span>}
                                {item.size && <span> | Size: {item.size}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.quantity}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;