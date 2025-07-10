import React from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusActions = {
  pending: 'Accept Order',
  accepted: 'Mark as Delivered',
  delivered: null,
  cancelled: null
};

const OrderStatusBadge = ({ status, onActionClick }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {statusActions[status] && (
        <button
          onClick={onActionClick}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {statusActions[status]}
        </button>
      )}
    </div>
  );
};

export default OrderStatusBadge;