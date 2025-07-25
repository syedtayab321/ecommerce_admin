import React, { memo } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';

const formatCurrency = (value) => {
  if (isNaN(value) || value == null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'N/A'
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  } catch {
    return 'N/A';
  }
};

const getStatusBadge = (status) => {
  const statusClasses = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
        statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
    </span>
  );
};

const getStockDisplay = (stock) => {
  if (stock === undefined || stock === null) return 'N/A';
  return (
    <div className="flex flex-col">
      <span className="font-medium">{stock}</span>
      <span
        className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
          stock > 10
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
            : stock > 0
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        }`}
      >
        {stock > 10 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'}
      </span>
    </div>
  );
};

const ProductsTable = memo(({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Cost
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Stock
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Updated
            </th>
            <th
              scope="col"
              className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
          {products.map((product) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <img
                      src={product.images || 'https://developer.woocommerce.com/wp-content/uploads/sites/2/2024/11/943.png?w=1024'}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://developer.woocommerce.com/wp-content/uploads/sites/2/2024/11/943.png?w=1024';
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.sku || 'N/A'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {product.category || 'N/A'}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {product.price ? formatCurrency(product.price) : 'N/A'}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-white">
                {getStockDisplay(product.stock)}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                {getStatusBadge(product.status)}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(product.updatedAt || product.createdAt)}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                    title="Edit product"
                    aria-label="Edit product"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50"
                    title="Delete product"
                    aria-label="Delete product"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ProductsTable;