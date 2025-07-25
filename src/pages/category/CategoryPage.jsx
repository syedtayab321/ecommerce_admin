import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Lazy load components
const CategoriesTable = lazy(() => import('../../components/category/CategoryTable'));
const CategoryFilters = lazy(() => import('../../components/category/CategoryFilters'));
const CategoryModal = lazy(() => import('../../components/category/CategoryModal'));

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { items: categories, loading, error, currentCategory } = useSelector(
    (state) => state.categories
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'An error occurred', { autoClose: 3000 });
    }
  }, [error]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filters.search.toLowerCase())
  );

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
        await dispatch(removeCategory(id)).unwrap();
        toast.success('Category deleted successfully', { autoClose: 3000 });
      } catch (error) {
        toast.error(error.message || 'Failed to delete category', { autoClose: 3000 });
      }
    }
  };

  const handleSubmit = async (categoryData) => {
    try {
      if (currentCategory) {
        await dispatch(editCategory({ id: currentCategory.id, categoryData })).unwrap();
        toast.success('Category updated successfully', { autoClose: 3000 });
      } else {
        await dispatch(createCategory(categoryData)).unwrap();
        toast.success('Category created successfully', { autoClose: 3000 });
      }
      setIsModalOpen(false);
      dispatch(clearCurrentCategory());
    } catch (error) {
      toast.error(error.message || 'An error occurred while saving the category', {
        autoClose: 3000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Categories Management
          </h1>
          <button
            onClick={() => {
              dispatch(clearCurrentCategory());
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Add Category
          </button>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded-lg mb-6" />
          }
        >
          <CategoryFilters filters={filters} setFilters={setFilters} loading={loading} />
        </Suspense>

        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
          }
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
            <CategoriesTable
              categories={paginatedCategories}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      filteredCategories.length
                    )}
                  </span>{' '}
                  of <span className="font-medium">{filteredCategories.length}</span>{' '}
                  categories
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.max(prev.currentPage - 1, 1),
                      }))
                    }
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                    disabled={
                      pagination.currentPage * pagination.itemsPerPage >=
                      filteredCategories.length
                    }
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <CategoryModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              dispatch(clearCurrentCategory());
            }}
            initialValues={currentCategory}
            onSubmit={handleSubmit}
          />
        </Suspense>
      </div>
    </motion.div>
  );
};

export default CategoriesPage;