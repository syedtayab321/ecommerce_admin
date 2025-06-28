import React from 'react';

const TopProducts = () => {
  const products = [
    {
      name: 'Wireless Headphones',
      sales: 1245,
      revenue: '$18,675'
    },
    {
      name: 'Smart Watch',
      sales: 892,
      revenue: '$13,380'
    },
    {
      name: 'Bluetooth Speaker',
      sales: 753,
      revenue: '$9,036'
    },
    {
      name: 'Laptop Backpack',
      sales: 621,
      revenue: '$6,210'
    },
    {
      name: 'Phone Case',
      sales: 587,
      revenue: '$2,935'
    }
  ];

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-4">Top Selling Products</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-3">
              <span className="font-medium">{index + 1}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{product.sales} sold</span>
                <span>{product.revenue}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${(product.sales / 1245) * 100}%` }}
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