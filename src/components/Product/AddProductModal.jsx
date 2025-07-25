import React, { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories } from '../../redux/services/categoryService';

const ProductModal = ({ isOpen, onClose, initialValues, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const DEFAULT_IMAGE_URL = 'https://cdn-icons-png.flaticon.com/512/1440/1440523.png';

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Product name is required')
      .max(100, 'Name must be less than 100 characters'),
    category: Yup.string().required('Category is required'),
    price: Yup.number()
      .required('Price is required')
      .min(0.01, 'Price must be greater than 0')
      .max(100000, 'Price must be less than 100,000'),
    costPrice: Yup.number()
      .min(0, 'Cost price cannot be negative')
      .max(100000, 'Cost price must be less than 100,000')
      .nullable(),
    stock: Yup.number()
      .required('Stock quantity is required')
      .min(0, 'Stock cannot be negative')
      .integer('Stock must be a whole number')
      .max(100000, 'Stock must be less than 100,000'),
    status: Yup.string().required('Status is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      price: '',
      costPrice: '',
      stock: '',
      status: 'published',
      images: DEFAULT_IMAGE_URL,
      ...initialValues,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const finalValues = {
          ...values,
          images: values.images instanceof File ? values.images : values.images || DEFAULT_IMAGE_URL,
        };
        await onSubmit(finalValues);
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true);
      getCategories()
        .then((cats) => {
          setCategories(cats);
          if (initialValues?.category && !cats.some((c) => c.name === initialValues.category)) {
            setCategories((prev) => [...prev, { name: initialValues.category }]);
          }
        })
        .catch((error) => {
          console.error('Failed to load categories:', error);
        })
        .finally(() => {
          setLoadingCategories(false);
        });
    }
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (typeof formik.values.images === 'string') {
      setPreviewImage(formik.values.images);
      return;
    }

    if (formik.values.images instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.onerror = () => setPreviewImage(DEFAULT_IMAGE_URL);
      reader.readAsDataURL(formik.values.images);
      return;
    }

    setPreviewImage(DEFAULT_IMAGE_URL);
  }, [formik.values.images]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-indigo-600 dark:bg-indigo-900 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-lg font-medium text-white">
                {initialValues ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close modal"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Image
                  </label>
                  <div className="flex items-center">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      <img
                        src={previewImage || DEFAULT_IMAGE_URL}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE_URL; }}
                      />
                    </div>
                    <div className="ml-4 space-y-2">
                      <label
                        htmlFor="images"
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiUpload className="h-4 w-4 mr-2" />
                        {previewImage !== DEFAULT_IMAGE_URL ? 'Change' : 'Upload'}
                      </label>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          formik.setFieldValue('images', event.currentTarget.files[0] || DEFAULT_IMAGE_URL);
                        }}
                      />
                      {previewImage !== DEFAULT_IMAGE_URL && (
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue('images', DEFAULT_IMAGE_URL);
                            setPreviewImage(DEFAULT_IMAGE_URL);
                          }}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 block w-full rounded-md border ${
                        formik.touched.name && formik.errors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm sm:text-sm py-2 px-3 disabled:opacity-50`}
                      disabled={isSubmitting}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 block w-full rounded-md border ${
                        formik.touched.category && formik.errors.category
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm sm:text-sm py-2 px-3 disabled:opacity-50`}
                      disabled={loadingCategories || isSubmitting}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id || category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {loadingCategories && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Loading categories...
                      </p>
                    )}
                    {formik.touched.category && formik.errors.category && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 block w-full rounded-md border ${
                        formik.touched.status && formik.errors.status
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                      } bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm sm:text-sm py-2 px-3 disabled:opacity-50`}
                      disabled={isSubmitting}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.status}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Price *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        step="0.01"
                        min="0.01"
                        className={`block w-full pl-7 pr-12 rounded-md border ${
                          formik.touched.price && formik.errors.price
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm sm:text-sm py-2 px-3 disabled:opacity-50`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                      />
                    </div>
                    {formik.touched.price && formik.errors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.price}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="costPrice"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Cost Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="costPrice"
                        name="costPrice"
                        value={formik.values.costPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        step="0.01"
                        min="0"
                        className={`block w-full pl-7 pr-12 rounded-md border ${
                          formik.touched.costPrice && formik.errors.costPrice
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm sm:text-sm py-2 px-3 disabled:opacity-50`}
                        placeholder="0.00"
                        disabled={isSubmitting}
                      />
                    </div>
                    {formik.touched.costPrice && formik.errors.costPrice && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.costPrice}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      min="0"
                      step="1"
                      className={`mt-1 block w-full rounded-md border ${
                        formik.touched.stock && formik.errors.stock
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm sm:text-sm py-2 px-3 disabled:opacity-50`}
                      disabled={isSubmitting}
                    />
                    {formik.touched.stock && formik.errors.stock && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formik.errors.stock}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-600 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : initialValues ? (
                    'Update Product'
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;