import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import CategoriesTable from '../../components/category/CategoryTable';
import CategoryFilters from '../../components/category/CategoryFilters';
import CategoryModal from '../../components/category/CategoryModal';
import Button from '../../components/common/Button';

const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'active'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  });

  // Mock data - replace with API calls
  const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', status: 'active', products: 42, createdAt: '2023-01-15' },
    { id: 2, name: 'Clothing', slug: 'clothing', status: 'active', products: 128, createdAt: '2023-02-20' },
    { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', status: 'active', products: 76, createdAt: '2023-03-10' },
    // ... more categories
  ];

  const filteredCategories = categories.filter(cat => {
    return (
      cat.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.status === 'all' || cat.status === filters.status)
    );
  });

  const paginatedCategories = filteredCategories.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // Confirm and delete logic
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log('Deleting category:', id);
    }
  };

  const handleSubmit = (categoryData) => {
    console.log('Saving category:', categoryData);
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Categories Management</h1>
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
            variant="primary"
            icon={<FiPlus className="mr-2" />}
          >
            Add Category
          </Button>
        </div>

        {/* Filters */}
        <CategoryFilters filters={filters} setFilters={setFilters} />

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <CategoriesTable 
            categories={paginatedCategories} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, filteredCategories.length)}
                </span> of{' '}
                <span className="font-medium">{filteredCategories.length}</span> categories
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({
                    ...prev,
                    currentPage: Math.max(prev.currentPage - 1, 1)
                  }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({
                    ...prev,
                    currentPage: prev.currentPage + 1
                  }))}
                  disabled={pagination.currentPage * pagination.itemsPerPage >= filteredCategories.length}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        initialValues={selectedCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CategoriesPage;