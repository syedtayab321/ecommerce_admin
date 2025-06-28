import React from 'react';
import { FiPackage, FiCheckCircle, FiTruck, FiClock } from 'react-icons/fi';

const RecentOrders = () => {
  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      date: '2023-05-15',
      amount: '$125.00',
      status: 'completed',
      items: 2
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Johnson',
      date: '2023-05-14',
      amount: '$89.50',
      status: 'shipped',
      items: 3
    },
    {
      id: '#ORD-003',
      customer: 'Michael Brown',
      date: '2023-05-14',
      amount: '$234.00',
      status: 'processing',
      items: 5
    },
    {
      id: '#ORD-004',
      customer: 'Emily Davis',
      date: '2023-05-13',
      amount: '$56.75',
      status: 'completed',
      items: 1
    },
    {
      id: '#ORD-005',
      customer: 'Robert Wilson',
      date: '2023-05-12',
      amount: '$178.30',
      status: 'shipped',
      items: 4
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FiTruck className="text-blue-500" />;
      default:
        return <FiClock className="text-amber-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 capitalize">{order.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;