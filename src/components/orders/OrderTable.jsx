import React, { useState } from 'react';
import { FiEye, FiPrinter, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import OrderStatusBadge from './OrderStatusBadge';
import ConfirmOrderModal from './ConfirmOrderModal';
import OrderFilters from './OrderFilters';
import { formatDate, formatCurrency } from './order.utils';
import { tableStyles } from './order.styles';

const OrdersTable = ({ 
  orders, 
  onStatusChange, 
  onDelete, 
  onView, 
  onPrint 
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Date filter
    const orderDate = new Date(order.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const matchesDate = 
      dateFilter === 'all' ||
      (dateFilter === 'today' && orderDate >= today) ||
      (dateFilter === 'week' && orderDate >= new Date(today.setDate(today.getDate() - today.getDay()))) ||
      (dateFilter === 'month' && orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleStatusAction = (order) => {
    if (order.status === 'pending') {
      setSelectedOrder(order);
      setShowConfirmModal(true);
    } else if (order.status === 'accepted') {
      onStatusChange(order.id, 'delivered');
    }
  };

  const handleConfirmOrder = ({ discount, notes }) => {
    onStatusChange(selectedOrder.id, 'accepted', { discount, notes });
    setShowConfirmModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        onResetFilters={resetFilters}
      />

      <div className={tableStyles.container}>
        <table className={tableStyles.table}>
          {/* Table Head remains the same as before */}
          <thead className={tableStyles.thead}>
            <tr>
              <th className={tableStyles.th}>Order ID</th>
              <th className={tableStyles.th}>Customer</th>
              <th className={tableStyles.th}>Date</th>
              <th className={tableStyles.th}>Status</th>
              <th className={tableStyles.th}>Total</th>
              <th className={`${tableStyles.th} text-right`}>Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.id} className={tableStyles.tr}>
                  {/* Table cells remain the same as before */}
                  <td className={tableStyles.td}>
                    <div className={tableStyles.textPrimary}>#{order.id}</div>
                  </td>
                  <td className={tableStyles.td}>
                    <div className={tableStyles.textPrimary}>{order.customer.name}</div>
                    <div className={tableStyles.textSecondary}>{order.customer.email}</div>
                  </td>
                  <td className={tableStyles.td}>
                    <div className={tableStyles.textSecondary}>{formatDate(order.date)}</div>
                  </td>
                  <td className={tableStyles.td}>
                    <OrderStatusBadge 
                      status={order.status} 
                      onActionClick={() => handleStatusAction(order)}
                    />
                  </td>
                  <td className={tableStyles.td}>
                    <div className={tableStyles.textPrimary}>
                      {formatCurrency(order.total)}
                      {order.discount > 0 && (
                        <span className="ml-2 text-xs text-green-600">
                          ({order.discount}% off)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={`${tableStyles.td} text-right`}>
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
                        onClick={() => onDelete(order.id)}
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
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
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
                  {Math.min(indexOfLastOrder, filteredOrders.length)}
                </span>{' '}
                of <span className="font-medium">{filteredOrders.length}</span> results
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
                
                {/* Page numbers */}
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
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default OrdersTable;