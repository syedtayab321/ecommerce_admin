import React, { useState } from 'react';
import CustomersTable from './../../components/customers/CustomersTable';
import CustomerOrdersModal from './../../components/customers/CustomerOrdersModal';

const CustomersPage = () => {
  // Sample data - replace with your actual data fetching logic
  const [customers, setCustomers] = useState([
    {
      id: '1001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      totalOrders: 5,
      totalSpent: 1250.75,
      lastOrder: '2023-05-15',
      joinDate: '2022-01-10',
    },
    {
      id: '1002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      totalOrders: 12,
      totalSpent: 3420.50,
      lastOrder: '2023-05-18',
      joinDate: '2021-11-05',
    },
    // Add more customers as needed
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  const fetchCustomerOrders = (customerId) => {
    // Replace with your actual API call
    const orders = [
      {
        id: 'ORD-1001',
        date: '2023-05-15',
        status: 'delivered',
        items: 3,
        total: 350.25,
      },
      {
        id: 'ORD-987',
        date: '2023-04-28',
        status: 'delivered',
        items: 5,
        total: 420.50,
      },
      // Add more orders as needed
    ];
    setCustomerOrders(orders);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.id);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setCustomerOrders([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Search customers..."
            className="px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Customer
          </button>
        </div>
      </div>

      <CustomersTable 
        customers={customers} 
        onSelectCustomer={handleSelectCustomer} 
      />

      <CustomerOrdersModal
        customer={selectedCustomer}
        orders={customerOrders}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CustomersPage;