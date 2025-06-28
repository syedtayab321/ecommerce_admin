import React, { useState, useEffect } from 'react';

const ConfirmOrderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  order 
}) => {
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setDiscount('');
      setNotes('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const calculateTotal = () => {
    const discountValue = discount ? Number(discount) : 0;
    const discountAmount = order.total * (discountValue / 100);
    return (order.total - discountAmount).toFixed(2);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === '' || (!isNaN(value) && value >= 0 && value <= 100)) {
      setDiscount(value);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({ 
        discount: discount ? Number(discount) : 0, 
        notes 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const finalTotal = calculateTotal();
  const discountValue = discount ? Number(discount) : 0;
  const discountAmount = order.total * (discountValue / 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Order #{order.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-gray-700">Customer: {order.customer.name}</p>
              <p className="text-gray-600">{order.customer.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Order Total</p>
                <p className="font-semibold">${order.total.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Final Total</p>
                <p className="font-semibold text-green-600">${finalTotal}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
              {discountValue > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  Discount: -${discountAmount.toFixed(2)} ({discountValue}%)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                rows="3"
                placeholder="Any special instructions..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;