import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, 
  createCategory, 
  editCategory, 
  removeCategory,
  setCurrentCategory,
  clearCurrentCategory
} from '../../redux/slices/categorySlice';
import CategoriesTable from '../../components/category/CategoryTable';
import CategoryFilters from '../../components/category/CategoryFilters';
import CategoryModal from '../../components/category/CategoryModal';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { 
    items: categories, 
    loading, 
    error,
    currentCategory 
  } = useSelector((state) => state.categories);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [error]);

  const filteredCategories = categories.filter(cat => {
    return cat.name.toLowerCase().includes(filters.search.toLowerCase());
  });

  const paginatedCategories = filteredCategories.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  const handleEdit = (category) => {
    dispatch(setCurrentCategory(category));
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await dispatch(removeCategory(id));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (categoryData) => {
    try {
      if (currentCategory) {
        await dispatch(editCategory({ id: currentCategory.id, categoryData }));
        toast.success('Category updated successfully');
      } else {
        await dispatch(createCategory(categoryData));
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'An error occurred while saving the category');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Categories Management</h1>
          <Button
            onClick={() => {
              dispatch(clearCurrentCategory());
              setIsModalOpen(true);
            }}
            variant="primary"
            icon={<FiPlus className="mr-2" />}
          >
            Add Category
          </Button>
        </div>

        <CategoryFilters 
          filters={filters} 
          setFilters={setFilters} 
          loading={loading}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <CategoriesTable 
            categories={paginatedCategories} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                </span> to{' '}
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(clearCurrentCategory());
        }}
        initialValues={currentCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CategoriesPage;