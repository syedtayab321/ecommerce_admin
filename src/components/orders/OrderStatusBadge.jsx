import React from 'react';

const statusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: '⏳',
    actionLabel: 'Confirm Order',
    actionClass: 'bg-yellow-500 hover:bg-yellow-600'
  },
  accepted: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: '✓',
    actionLabel: 'Mark as Delivered',
    actionClass: 'bg-blue-500 hover:bg-blue-600'
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: '🚚',
    actionLabel: 'Completed',
    actionClass: 'bg-green-500 hover:bg-green-600 cursor-default'
  }
};

const OrderStatusBadge = ({ status, onActionClick }) => {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <div className="flex flex-col items-center space-y-2">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      
      {status !== 'delivered' && (
        <button
          onClick={() => onActionClick()}
          className={`px-3 py-1 text-xs text-white rounded-md transition-colors ${config.actionClass}`}
        >
          {config.actionLabel}
        </button>
      )}
    </div>
  );
};

export default OrderStatusBadge;