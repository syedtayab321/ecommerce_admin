import React, { useState, useEffect } from 'react';
import { FiX, FiUpload, FiImage } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from './../components/common/Button';

const ProductModal = ({ isOpen, onClose, initialValues, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    sku: Yup.string().required('SKU is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0.01, 'Price must be greater than 0'),
    costPrice: Yup.number()
      .min(0, 'Cost price cannot be negative')
      .nullable(),
    stock: Yup.number()
      .required('Stock quantity is required')
      .min(0, 'Stock cannot be negative')
      .integer('Stock must be a whole number'),
    description: Yup.string().max(500, 'Description too long'),
    images: Yup.mixed()
      .test('fileSize', 'File too large', (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test('fileType', 'Unsupported file type', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
      })
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      sku: '',
      category: '',
      price: '',
      costPrice: '',
      stock: '',
      description: '',
      status: 'published',
      images: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        onClose();
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Handle image preview
  useEffect(() => {
    if (formik.values.images) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(formik.values.images);
    } else {
      setPreviewImage(null);
    }
  }, [formik.values.images]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Blurred Overlay */}
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 transition-opacity" onClick={onClose}></div>

      {/* Modal Container - centered with focus area */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Modal Content - this will be the focused area */}
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
        >
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-6 w-6" />
            </button>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex-1">
              {initialValues ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit} className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="space-y-6">
              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="mt-1 flex items-center">
                  <div className="relative w-32 h-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiImage className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <label
                      htmlFor="images"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center"
                    >
                      <FiUpload className="h-4 w-4 mr-2" />
                      Upload
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        formik.setFieldValue('images', event.currentTarget.files[0]);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                {formik.touched.images && formik.errors.images && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.images}</p>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full border ${formik.touched.name && formik.errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formik.values.sku}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full border ${formik.touched.sku && formik.errors.sku ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.sku && formik.errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.sku}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full border ${formik.touched.category && formik.errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Books">Books</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Selling Price *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0.01"
                      step="0.01"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-7 pr-12 border ${formik.touched.price && formik.errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  {formik.touched.price && formik.errors.price && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                    Cost Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="costPrice"
                      name="costPrice"
                      min="0"
                      step="0.01"
                      value={formik.values.costPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`block w-full pl-7 pr-12 border ${formik.touched.costPrice && formik.errors.costPrice ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  {formik.touched.costPrice && formik.errors.costPrice && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.costPrice}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full border ${formik.touched.stock && formik.errors.stock ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.stock}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full border ${formik.touched.description && formik.errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              type="button"
              variant="primary"
              onClick={formik.handleSubmit}
              loading={isSubmitting}
              className="ml-3"
            >
              {initialValues ? 'Update Product' : 'Add Product'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;