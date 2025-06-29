import React from 'react';
import { modalStyles } from './Customer.styles';
import { formatDate, formatCurrency, getStatusBadge } from './Customer.utils';

const CustomerOrdersModal = ({ customer, orders, onClose }) => {
  if (!customer) return null;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>
            {customer.name}'s Orders ({orders.length})
          </h2>
          <button
            onClick={onClose}
            className={modalStyles.closeButton}
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={modalStyles.body}>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
              <p className="mt-1 text-sm font-medium">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
              {customer.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Order Summary</h3>
              <p className="mt-1 text-sm">
                <span className="font-medium">Total Orders:</span> {customer.totalOrders}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total Spent:</span> {formatCurrency(customer.totalSpent)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
              <p className="mt-1 text-sm">
                <span className="font-medium">Last Order:</span> {customer.lastOrder ? formatDate(customer.lastOrder) : 'N/A'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Member Since:</span> {formatDate(customer.joinDate)}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={modalStyles.footer}>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersModal;