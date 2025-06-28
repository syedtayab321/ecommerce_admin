import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import ProductsTable from './../../components/Product/ProductTable';
import ProductFilters from './../../components/Product/ProductFilters';
import Pagination from './../../components/Product/Pagination';
import Button from './../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import ProductModal from './../../Models/AddProductModal'

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    stockStatus: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  // Fetch products (mock data for demonstration)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API with filters and pagination
        const mockProducts = generateMockProducts();
        setProducts(mockProducts);
        setPagination(prev => ({ ...prev, totalItems: mockProducts.length }));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, pagination.currentPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleDelete = (productId) => {
    // Confirm and delete logic
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };


  const handleSubmit = async (productData) => {
    // Handle form submission (API call)
    console.log('Submitting product:', productData);
    // Reset modal state
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Product Management</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            icon={<FiPlus className="mr-2" />}
          >
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : (
            <>
              <ProductsTable 
                products={products} 
                onEdit={(id) => navigate(`/products/edit/${id}`)} 
                onDelete={handleDelete}
              />
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.currentPage}
                  itemsPerPage={pagination.itemsPerPage}
                  totalItems={pagination.totalItems}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>


      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        initialValues={selectedProduct}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

// Mock data generator for demonstration
const generateMockProducts = () => {
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty'];
  const statuses = ['Published', 'Draft', 'Archived'];
  const stockStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];
  
  return Array.from({ length: 45 }, (_, i) => ({
    id: `prod_${i + 1}`,
    name: `Product ${i + 1}`,
    sku: `SKU-${1000 + i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: (Math.random() * 100 + 10).toFixed(2),
    stock: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    stockStatus: stockStatuses[Math.floor(Math.random() * stockStatuses.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
  }));
};

export default ProductsPage;