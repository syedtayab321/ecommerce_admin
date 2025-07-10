// src/pages/ProductsPage.js
import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import ProductsTable from '../../components/Product/ProductTable';
import ProductFilters from '../../components/Product/ProductFilters';
import Pagination from '../../components/Product/Pagination';
import Button from '../../components/common/Button';
import ProductModal from '../../components/Product/AddProductModal';
import DeleteConfirmationModal from '../../components/common/deleteConfirmationModal';
import { toast } from 'react-toastify';
import emptyStateImage from './../../../public/Assets/images/empty-state.png';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductsPage = () => {
  const navigate = useNavigate();
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
    itemsPerPage: 10
  });

  useEffect(() => {
    dispatch(fetchProducts(reduxFilters));
  }, [dispatch, reduxFilters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await dispatch(removeProduct(productToDelete));
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      dispatch(fetchProducts(reduxFilters)); // Refresh the products list
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      dispatch(setCurrentProduct(product));
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (currentProduct) {
        await dispatch(editProduct({ 
          id: currentProduct.id, 
          productData 
        }));
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(productData));
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
      dispatch(clearCurrentProduct());
      dispatch(fetchProducts(reduxFilters)); // Refresh the products list
    } catch (error) {
      toast.error(`Failed to save product: ${error.message}`);
    }
  };

  const paginatedProducts = products.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Processing overlay */}
        {processing && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentProduct ? 'Updating Product...' : 'Creating Product...'}
              </h3>
              <p className="text-gray-600">
                Please wait while we {currentProduct ? 'update' : 'save'} your product.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Product Management</h1>
          <Button
            onClick={() => {
              dispatch(clearCurrentProduct());
              setIsModalOpen(true);
            }}
            variant="primary"
            icon={<FiPlus className="mr-2" />}
          >
            Add Product
          </Button>
        </div>

        <ProductFilters 
          filters={reduxFilters} 
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          {loading ? (
            <div className="p-8 text-center">
              <LoadingSpinner size="md" className="mx-auto" />
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <img 
                src={emptyStateImage} 
                alt="No products found" 
                className="mx-auto h-64 w-64 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or add a new product</p>
              <Button
                onClick={() => {
                  dispatch(resetFilters());
                  dispatch(clearCurrentProduct());
                  setIsModalOpen(true);
                }}
                variant="primary"
                icon={<FiPlus className="mr-2" />}
              >
                Add New Product
              </Button>
            </div>
          ) : (
            <>
              <ProductsTable 
                products={paginatedProducts} 
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
              <div className="px-6 py-4 border-t border-gray-200">
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
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(clearCurrentProduct());
        }}
        initialValues={currentProduct}
        onSubmit={handleSubmit}
      />

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
    </div>
  );
};

export default ProductsPage;