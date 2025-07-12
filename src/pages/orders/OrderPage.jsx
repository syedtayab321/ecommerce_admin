import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrdersTable from './../../components/orders/OrderTable';
import { getOrders } from './../../redux/slices/orderSlice';
import OrderDetailsModal from './../../components/orders/OrderDetailsModal';
import { generateInvoicePDF } from './../../components/orders/InvoiceGenerator';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePrint = async (order) => {
    try {
      await generateInvoicePDF(order);
      toast.success('Invoice generated successfully!');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to generate invoice. Please try again.');
    }
  };

  const handleRefresh = () => {
    dispatch(getOrders());
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>
      <OrdersTable
        onView={handleView}
        onPrint={handlePrint}
      />
      
      {isModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrdersPage;