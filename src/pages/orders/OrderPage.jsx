import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrdersTable from './../../components/orders/OrderTable';
import { getOrders } from './../../redux/slices/orderSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.orders);

  const handleView = (order) => {
    console.log('Viewing order:', order);
    // Implement detailed view modal here
  };

  const handlePrint = (order) => {
    console.log('Printing order:', order);
    // Implement print functionality here
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button
          onClick={() => dispatch(getOrders())}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>
      <OrdersTable
        onView={handleView}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default OrdersPage;