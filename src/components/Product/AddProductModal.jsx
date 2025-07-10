// src/components/Product/ProductModal.js
import React, { useState, useEffect } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../common/Button";
import { getCategories } from "./../../redux/services/categoryService";

const ProductModal = ({ isOpen, onClose, initialValues, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const DEFAULT_IMAGE_URL = "https://cdn-icons-png.flaticon.com/512/1440/1440523.png";

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Product name is required")
      .max(100, "Name must be less than 100 characters"),
    category: Yup.string().required("Category is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0.01, "Price must be greater than 0")
      .max(100000, "Price must be less than 100,000"),
    costPrice: Yup.number()
      .min(0, "Cost price cannot be negative")
      .max(100000, "Cost price must be less than 100,000")
      .nullable(),
    stock: Yup.number()
      .required("Stock quantity is required")
      .min(0, "Stock cannot be negative")
      .integer("Stock must be a whole number")
      .max(100000, "Stock must be less than 100,000"),
    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      category: "",
      price: "",
      costPrice: "",
      stock: "",
      status: "published",
      images: DEFAULT_IMAGE_URL,
      ...initialValues,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const finalValues = {
          ...values,
          images: values.images instanceof File ? values.images : values.images || DEFAULT_IMAGE_URL,
        };
        await onSubmit(finalValues);
        onClose();
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true);
      getCategories()
        .then(cats => {
          setCategories(cats);
          // If initialValues has a category that's not in the list, add it
          if (initialValues?.category && !cats.some(c => c.name === initialValues.category)) {
            setCategories(prev => [...prev, { name: initialValues.category }]);
          }
        })
        .catch(error => {
          console.error("Failed to load categories:", error);
        })
        .finally(() => {
          setLoadingCategories(false);
        });
    }
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (typeof formik.values.images === "string") {
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

  useEffect(() => {
    if (initialValues) {
      formik.setValues({
        name: initialValues.name || "",
        category: initialValues.category || "",
        price: initialValues.price || "",
        costPrice: initialValues.costPrice || "",
        stock: initialValues.stock || "",
        status: initialValues.status || "published",
        images: initialValues.images || DEFAULT_IMAGE_URL,
      });
    } else {
      formik.resetForm();
    }
  }, [initialValues]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30" onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}>
          
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {initialValues ? "Edit Product" : "Add New Product"}
            </h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="px-6 py-4">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="flex items-center">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img
                      src={previewImage || DEFAULT_IMAGE_URL}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_IMAGE_URL; }}
                    />
                  </div>
                  <div className="ml-4 space-y-2">
                    <label htmlFor="images" className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <FiUpload className="h-4 w-4 mr-2" />
                      {previewImage !== DEFAULT_IMAGE_URL ? "Change" : "Upload"}
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => {
                        formik.setFieldValue("images", event.currentTarget.files[0] || DEFAULT_IMAGE_URL);
                      }}
                    />
                    {previewImage !== DEFAULT_IMAGE_URL && (
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("images", DEFAULT_IMAGE_URL);
                          setPreviewImage(DEFAULT_IMAGE_URL);
                        }}
                        className="text-sm text-red-600 hover:text-red-800 inline-flex items-center"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full rounded-md border ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } shadow-sm sm:text-sm py-2 px-3`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full rounded-md border ${
                      formik.touched.category && formik.errors.category
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } shadow-sm sm:text-sm py-2 px-3`}
                    disabled={loadingCategories}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id || category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {loadingCategories && (
                    <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
                  )}
                  {formik.touched.category && formik.errors.category && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`mt-1 block w-full rounded-md border ${
                      formik.touched.status && formik.errors.status
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } shadow-sm sm:text-sm py-2 px-3`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.status}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
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
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } shadow-sm sm:text-sm py-2 px-3`}
                      placeholder="0.00"
                    />
                  </div>
                  {formik.touched.price && formik.errors.price && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">Cost Price</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
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
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } shadow-sm sm:text-sm py-2 px-3`}
                      placeholder="0.00"
                    />
                  </div>
                  {formik.touched.costPrice && formik.errors.costPrice && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.costPrice}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
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
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } shadow-sm sm:text-sm py-2 px-3`}
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.stock}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="px-4 py-2"
              >
                {initialValues ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;