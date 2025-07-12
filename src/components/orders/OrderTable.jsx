import React, { useEffect, useState } from 'react';
import { FiEye, FiPrinter, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getOrders, 
  changeOrderStatus, 
  acceptOrder, 
  removeOrder,
  setFilters,
  resetFilters,
  setCurrentOrder
} from './../../redux/slices/orderSlice';
import OrderStatusBadge from './OrderStatusBadge';
import OrderFilters from './OrderFilters';
import ConfirmOrderModal from './ConfirmOrderModal';
import { formatDate, formatCurrency } from './order.utils';

const OrdersTable = ({ 
  onView, 
  onPrint 
}) => {
  const dispatch = useDispatch();
  const { 
    orders, 
    loading, 
    error, 
    filters,
    currentOrder 
  } = useSelector(state => state.orders);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const ordersPerPage = 10;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        await dispatch(getOrders(filters)).unwrap();
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load orders');
      }
    };
    
    loadOrders();
  }, [dispatch, filters]);

  const handleStatusAction = async (order) => {
    try {
      dispatch(setCurrentOrder(order));
      if (order.status === 'placed') { // Changed from 'pending' to 'placed'
        setShowConfirmModal(true);
      } else if (order.status === 'accepted') {
        await dispatch(changeOrderStatus({ 
          orderId: order.id, 
          status: 'delivered' 
        })).unwrap();
        dispatch(getOrders);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update order status');
    }
  };

  const handleConfirmOrder = async ({ discount, notes }) => {
    try {
      await dispatch(acceptOrder({ 
        orderId: currentOrder.id, 
        discount, 
        notes,
        items: currentOrder.items || []
      })).unwrap();
      setShowConfirmModal(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to confirm order');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(removeOrder(orderId)).unwrap();
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete order');
      }
    }
  };

  const handleSearchChange = (e) => {
    dispatch(setFilters({ searchTerm: e.target.value }));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    dispatch(setFilters({ status: e.target.value }));
    setCurrentPage(1);
  };

  const handleDateFilterChange = (e) => {
    dispatch(setFilters({ dateFilter: e.target.value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setCurrentPage(1);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading && !orders.length) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{errorMessage || error}</p>
        </div>
      )}

      <OrderFilters
        searchTerm={filters.searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={filters.status}
        onStatusFilterChange={handleStatusFilterChange}
        dateFilter={filters.dateFilter}
        onDateFilterChange={handleDateFilterChange}
        onResetFilters={handleResetFilters}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.userId}</div>
                    <div className="text-sm text-gray-500">{order.shippingAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge 
                      status={order.status} 
                      onActionClick={() => handleStatusAction(order)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                      {order.discount > 0 && (
                        <span className="ml-2 text-xs text-green-600">
                          ({order.discount}% off)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onView(order)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onPrint(order)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="Print"
                      >
                        <FiPrinter className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastOrder, orders.length)}
                </span>{' '}
                of <span className="font-medium">{orders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmOrderModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmOrder}
          order={currentOrder}
          orderItems={currentOrder?.items || []}
        />
      )}
    </>
  );
};

export default OrdersTable;