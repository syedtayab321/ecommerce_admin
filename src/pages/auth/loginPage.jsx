import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginAdmin, clearError } from './../../redux/slices/authSlice';
import { motion } from 'framer-motion';
import Button from './../../components/common/Button';
import InputField from './../../components/common/InputField';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await dispatch(loginAdmin({
        email: formData.email,
        password: formData.password
      })).unwrap();
    } catch (err) {
      // Error is handled by authSlice
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
            <p className="text-indigo-100 mt-1">Sign in to continue</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                  <FaEnvelope className="h-5 w-5" />
                </div>
                <InputField
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  error={errors.email}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                  <FaLock className="h-5 w-5" />
                </div>
                <InputField
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  error={errors.password}
                  required
                  className="pl-10"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                isLoading={isSubmitting || loading}
                disabled={isSubmitting || loading}
                hoverEffect="lift"
                startIcon={!(isSubmitting || loading) && <FiLogIn className="h-5 w-5" />}
                className="mt-6"
              >
                {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;