import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getOrders } from '../../redux/slices/orderSlice';
import { formatCurrency, calculateDiscount } from './order.utils';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmOrderModal = ({ isOpen, onClose, onConfirm, order, orderItems }) => {
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      setDiscount(order.discount?.toString() || '');
      setNotes(order.notes || '');
      setIsSubmitting(false);
      setError('');
    }
  }, [isOpen, order]);

  const { discountAmount, finalTotal } = calculateDiscount(
    order.totalAmount,
    discount ? Number(discount) : 0
  );

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && value >= 0 && value <= 100)) {
      setDiscount(value);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError('');

      if (orderItems.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      await onConfirm({ discount: Number(discount) || 0, notes, items: orderItems });
      dispatch(getOrders());
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to confirm order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Confirm Order #{order.id}
                </h2>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
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

              {error && (
                <div className="mt-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-3 rounded">
                  <p>{error}</p>
                </div>
              )}

              <div className="mt-6 space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    Customer ID: {order.userId}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Shipping: {order.shippingAddress}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Payment: {order.paymentMethod}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Order Total
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Final Total
                    </p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(finalTotal)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount (%)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={discount}
                      onChange={handleDiscountChange}
                      placeholder="0"
                      className="block w-full pl-3 pr-12 py-2 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                      disabled={isSubmitting}
                      aria-label="Discount percentage"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        %
                      </span>
                    </div>
                  </div>
                  {discount && Number(discount) > 0 && (
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                      Discount: -{formatCurrency(discountAmount)} ({discount}%)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    rows="3"
                    placeholder="Any special instructions..."
                    disabled={isSubmitting}
                    aria-label="Order notes"
                  />
                </div>

                <div className="border-t pt-4 dark:border-gray-700">
                  <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Order Items ({orderItems.length})
                  </h3>
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-start"
                        role="listitem"
                      >
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h4>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <p>Qty: {item.quantity}</p>
                            <p>Price: {formatCurrency(item.price)} each</p>
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </span>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmOrderModal;