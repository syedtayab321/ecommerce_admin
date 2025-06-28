import React, { useState } from "react";
import OrdersTable from "../../components/orders/OrderTable";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "1001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
      },
      date: "2023-05-15",
      status: "pending",
      total: 125.99,
      discount: 0,
      notes: "",
    },
    {
      id: "1002",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
      },
      date: "2023-05-14",
      status: "accepted",
      total: 89.5,
      discount: 10,
      notes: "Customer requested express shipping",
    },
    {
      id: "1003",
      customer: {
        name: "Bob Johnson",
        email: "bob@example.com",
      },
      date: "2023-05-13",
      status: "delivered",
      total: 210.0,
      discount: 15,
      notes: "Special corporate discount applied",
    },
  ]);

  const handleStatusChange = (
    orderId,
    newStatus,
    { discount = 0, notes = "" } = {}
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, discount, notes }
          : order
      )
    );
    // Here you would typically make an API call to update the order
    console.log(
      `Order ${orderId} updated to ${newStatus} with ${discount}% discount`
    );
  };

  const handleDelete = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    console.log(`Order ${orderId} deleted`);
  };

  const handleView = (order) => {
    console.log("Viewing order:", order);
    // You could implement a detailed view modal here
  };

  const handlePrint = (order) => {
    console.log("Printing order:", order);
    // You could implement print functionality here
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <OrdersTable
        orders={orders}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onView={handleView}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default OrdersPage;
