import React from 'react';
import { tableStyles } from './customer.styles';
import { formatDate, formatCurrency } from './Customer.utils';

const CustomersTable = ({ customers, onSelectCustomer }) => {
  return (
    <div className={tableStyles.container}>
      <table className={tableStyles.table}>
        <thead className={tableStyles.thead}>
          <tr>
            <th className={tableStyles.th}>Customer ID</th>
            <th className={tableStyles.th}>Name</th>
            <th className={tableStyles.th}>Email</th>
            <th className={tableStyles.th}>Phone</th>
            <th className={tableStyles.th}>Total Orders</th>
            <th className={tableStyles.th}>Total Spent</th>
            <th className={tableStyles.th}>Last Order</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr 
              key={customer.id} 
              className={tableStyles.tr}
              onClick={() => onSelectCustomer(customer)}
            >
              <td className={tableStyles.td}>
                <div className={tableStyles.textPrimary}>#{customer.id}</div>
              </td>
              <td className={tableStyles.td}>
                <div className={tableStyles.textPrimary}>
                  {customer.name}
                </div>
              </td>
              <td className={tableStyles.td}>
                <div className={tableStyles.textSecondary}>
                  {customer.email}
                </div>
              </td>
              <td className={tableStyles.td}>
                <div className={tableStyles.textSecondary}>
                  {customer.phone || 'N/A'}
                </div>
              </td>
              <td className={tableStyles.td}>
                <div className={tableStyles.textPrimary}>
                  {customer.totalOrders}
                </div>
              </td>
              <td className={tableStyles.td}>
                <div className={tableStyles.textPrimary}>
                  {formatCurrency(customer.totalSpent)}
                </div>
              </td>
              <td className={tableStyles.td}>
                <div className={tableStyles.textSecondary}>
                  {customer.lastOrder ? formatDate(customer.lastOrder) : 'No orders'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersTable;