import React from 'react';

const statusConfig = {
  placed: {
    color: 'bg-purple-100 text-purple-800',
    action: 'Accept Order',
    label: 'Placed'
  },
  accepted: {
    color: 'bg-blue-100 text-blue-800',
    action: 'Mark as Delivered',
    label: 'Accepted'
  },
  delivered: {
    color: 'bg-green-100 text-green-800',
    action: null,
    label: 'Delivered'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    action: null,
    label: 'Cancelled'
  }
};

const OrderStatusBadge = ({ status, onActionClick }) => {
  const config = statusConfig[status] || { 
    color: 'bg-gray-100 text-gray-800',
    action: null,
    label: status 
  };

  return (
    <div className="flex items-center space-x-2 min-w-[120px]">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
      {config.action && (
        <button
          onClick={onActionClick}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
        >
          {config.action}
        </button>
      )}
    </div>
  );
};

export default OrderStatusBadge;