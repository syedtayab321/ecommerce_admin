import React from 'react';

const statusConfig = {
  placed: {
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    action: 'Accept Order',
    label: 'Placed',
  },
  accepted: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    action: 'Mark as Delivered',
    label: 'Accepted',
  },
  delivered: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    action: null,
    label: 'Delivered',
  },
  cancelled: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    action: null,
    label: 'Cancelled',
  },
};

const OrderStatusBadge = ({ status, onActionClick }) => {
  const config = statusConfig[status] || {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    action: null,
    label: status,
  };

  return (
    <div className="flex items-center space-x-2 min-w-[120px]">
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        {config.label}
      </span>
      {config.action && (
        <button
          onClick={onActionClick}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium whitespace-nowrap"
        >
          {config.action}
        </button>
      )}
    </div>
  );
};

export default OrderStatusBadge;