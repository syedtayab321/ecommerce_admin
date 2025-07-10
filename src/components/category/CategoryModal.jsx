import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';

const CategoryModal = ({ isOpen, onClose, initialValues, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Category name is required')
      .max(100, 'Name must be less than 100 characters')
  });

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
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

  if (!isOpen) return null;

  return (
    <>
      {/* Blur Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
            <h3 className="text-lg font-medium text-white">
              {initialValues ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={formik.handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Name Field */}
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border ${
                      formik.touched.name && formik.errors.name 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3 border-t border-gray-200 sticky bottom-0">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={formik.handleSubmit}
                loading={isSubmitting}
              >
                {initialValues ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;