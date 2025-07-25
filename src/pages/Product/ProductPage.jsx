import { useState, useEffect, lazy, Suspense } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  createProduct, 
  editProduct, 
  removeProduct,
  setCurrentProduct,
  clearCurrentProduct,
  setFilters,
  resetFilters
} from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import emptyStateImage from './../../assets/images/empty-state.png';
import Pagination from './../../components/Product/Pagination';
// Lazy load components
const ProductsTable = lazy(() => import('../../components/Product/ProductTable'));
const ProductFilters = lazy(() => import('../../components/Product/ProductFilters'));
const ProductModal = lazy(() => import('../../components/Product/AddProductModal'));
const DeleteConfirmationModal = lazy(() => import('../../components/common/deleteConfirmationModal'));

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { 
    items: products, 
    loading, 
    error,
    filters: reduxFilters,
    currentProduct,
    processing
  } = useSelector((state) => state.products);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    dispatch(fetchProducts(reduxFilters));
  }, [dispatch, reduxFilters]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'An error occurred', { autoClose: 3000 });
    }
  }, [error]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await dispatch(removeProduct(productToDelete)).unwrap();
      toast.success('Product deleted successfully', { autoClose: 3000 });
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete product ', { autoClose: 3000 });
    }
  };

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      dispatch(setCurrentProduct(product));
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (currentProduct) {
        await dispatch(editProduct({ id: currentProduct.id, productData })).unwrap();
        toast.success('Product updated successfully', { autoClose: 3000 });
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success('Product added successfully', { autoClose: 3000 });
      }
      setIsModalOpen(false);
      dispatch(clearCurrentProduct());
    } catch (error) {
      toast.error(`Failed to save product: ${error.message || 'Unknown error'}`, {
        autoClose: 3000,
      });
    }
  };

  const paginatedProducts = products.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-7xl mx-auto">
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {currentProduct ? 'Updating Product...' : 'Creating Product...'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we {currentProduct ? 'update' : 'save'} your product.
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Product Management
          </h1>
          <button
            onClick={() => {
              dispatch(clearCurrentProduct());
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            <FiPlus className="mr-2 h-5 w-5" />
            Add Product
          </button>
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-16 rounded-lg mb-6" />
          }
        >
          <ProductFilters
            filters={reduxFilters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </Suspense>

        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />
          }
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center">
                <img
                  src={emptyStateImage}
                  alt="No products found"
                  className="mx-auto h-48 w-48 sm:h-64 sm:w-64 mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filters or add a new product
                </p>
                <button
                  onClick={() => {
                    dispatch(resetFilters());
                    dispatch(clearCurrentProduct());
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  <FiPlus className="mr-2 h-5 w-5" />
                  Add New Product
                </button>
              </div>
            ) : (
              <>
                <ProductsTable
                  products={paginatedProducts}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                  <Pagination
                    currentPage={pagination.currentPage}
                    itemsPerPage={pagination.itemsPerPage}
                    totalItems={products.length}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </Suspense>

        <Suspense fallback={null}>
          <ProductModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              dispatch(clearCurrentProduct());
            }}
            initialValues={currentProduct}
            onSubmit={handleSubmit}
          />
        </Suspense>

        <Suspense fallback={null}>
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setProductToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
            title="Delete Product"
            message="Are you sure you want to delete this product? This action cannot be undone."
          />
        </Suspense>
      </div>
    </motion.div>
  );
};

export default ProductsPage;