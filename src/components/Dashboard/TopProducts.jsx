import React from 'react';

const TopProducts = ({ orders }) => {
  const products = orders.length
    ? orders
        .reduce((acc, order) => {
          order.items?.forEach((item) => {
            const existing = acc.find((p) => p.name === item.name);
            if (existing) {
              existing.sales += item.quantity || 1;
              existing.revenue += (item.price || 0) * (item.quantity || 1);
            } else {
              acc.push({
                name: item.name || 'Unknown',
                sales: item.quantity || 1,
                revenue: (item.price || 0) * (item.quantity || 1),
              });
            }
          });
          return acc;
        }, [])
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
        .map((product) => ({
          ...product,
          revenue: `$${product.revenue.toLocaleString()}`,
        }))
    : [
        { name: 'Wireless Headphones', sales: 1245, revenue: '$18,675' },
        { name: 'Smart Watch', sales: 892, revenue: '$13,380' },
        { name: 'Bluetooth Speaker', sales: 753, revenue: '$9,036' },
        { name: 'Laptop Backpack', sales: 621, revenue: '$6,210' },
        { name: 'Phone Case', sales: 587, revenue: '$2,935' },
      ];

  return (
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Top Selling Products</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-lg p-2 mr-3">
              <span className="font-medium">{index + 1}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-white">{product.name}</h4>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>{product.sales} sold</span>
                <span>{product.revenue}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${(product.sales / (products[0]?.sales || 1245)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;