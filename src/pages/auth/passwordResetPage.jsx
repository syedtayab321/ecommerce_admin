import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiX } from 'react-icons/fi';
import { sendResetPasswordEmail, clearError } from './../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const ResetPasswordPage = React.memo(() => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(null);

  // Handle email input change
  const handleChange = useCallback((e) => {
    setEmail(e.target.value);
    if (error) {
      dispatch(clearError());
    }
    if (success) {
      setSuccess(null);
    }
  }, [error, dispatch]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await dispatch(sendResetPasswordEmail(email)).unwrap();
        setSuccess('Password reset email sent successfully. Please check your inbox.');
        setEmail('');
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch, email]
  );

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Reset Password</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 flex justify-between items-center"
            >
              <span>{error}</span>
              <button onClick={handleClearError} className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100">
                <FiX className="h-5 w-5" />
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Email Address"
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200`}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'} transition-all duration-200`}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : null}
            <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
          </motion.button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Back to <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
});

export default ResetPasswordPage;