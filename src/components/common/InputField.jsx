import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  success = '',
  info = '',
  disabled = false,
  required = false,
  icon,
  className = '',
  wrapperClassName = '',
  floatingLabel = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasValue = value && value.toString().length > 0;
  const showFloatingLabel = floatingLabel && (isFocused || hasValue);

  return (
    <div 
      className={`relative mb-6 ${wrapperClassName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!floatingLabel && label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Icon container with proper z-index */}
        {icon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center transition-colors duration-300 z-20 ${
            error ? 'text-red-500' : 
            success ? 'text-green-500' : 
            isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'
          }`}>
            {icon}
          </div>
        )}
        
        {/* Floating label with proper positioning */}
        {floatingLabel && label && (
          <motion.label
            htmlFor={name}
            className={`absolute left-0 px-3 transition-all duration-300 pointer-events-none z-10 ${
              showFloatingLabel 
                ? 'text-xs -top-2.5 bg-white dark:bg-gray-800 mx-2' 
                : 'text-sm top-3.5'
            } ${
              error ? 'text-red-500' : 
              success ? 'text-green-500' : 
              isFocused ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
            }`}
            initial={false}
            animate={{
              y: showFloatingLabel ? -12 : 0,
              fontSize: showFloatingLabel ? '0.75rem' : '0.875rem'
            }}
            style={{
              transformOrigin: 'left center',
              left: icon ? '2rem' : '0.75rem' // Adjust based on icon presence
            }}
          >
            {label}
            {required && <span className="text-red-500"> *</span>}
          </motion.label>
        )}
        
        {/* Input field with adjusted padding */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={floatingLabel && !showFloatingLabel ? placeholder : ''}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-10 py-3 border-2 ${
            error
              ? 'border-red-400 text-red-900 focus:ring-2 focus:ring-red-200 focus:border-red-500'
              : success
              ? 'border-green-400 text-green-900 focus:ring-2 focus:ring-green-200 focus:border-green-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 dark:focus:ring-indigo-800 dark:focus:border-indigo-400'
          } rounded-lg ${
            disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'
          } text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 ease-in-out sm:text-sm ${
            isHovered && !isFocused && !disabled && !error && !success ? 
              'shadow-sm border-gray-400 dark:border-gray-500' : ''
          } ${className}`}
          style={{
            paddingLeft: icon ? '2.5rem' : '0.75rem', // Consistent padding
            paddingTop: floatingLabel ? '1rem' : '0.75rem', // Extra space for floating label
            paddingBottom: floatingLabel ? '1rem' : '0.75rem'
          }}
          {...props}
        />
        
        {/* Validation Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20">
          {error && <FaExclamationCircle className="h-5 w-5 text-red-500" />}
          {success && !error && <FaCheckCircle className="h-5 w-5 text-green-500" />}
        </div>
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className={`h-5 w-5 transition-colors duration-300 ${
                error ? 'text-red-400 hover:text-red-500' : 
                success ? 'text-green-400 hover:text-green-500' : 
                'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
              }`} />
            ) : (
              <FaEye className={`h-5 w-5 transition-colors duration-300 ${
                error ? 'text-red-400 hover:text-red-500' : 
                success ? 'text-green-400 hover:text-green-500' : 
                'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
              }`} />
            )}
          </button>
        )}
      </div>
      
      {/* Validation Messages */}
      <AnimatePresence>
        {(error || success || info) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-1 flex items-start"
          >
            {error && (
              <>
                <FaExclamationCircle className="flex-shrink-0 h-4 w-4 mt-0.5 text-red-500" />
                <p className="ml-2 text-sm text-red-600">{error}</p>
              </>
            )}
            {success && !error && (
              <>
                <FaCheckCircle className="flex-shrink-0 h-4 w-4 mt-0.5 text-green-500" />
                <p className="ml-2 text-sm text-green-600">{success}</p>
              </>
            )}
            {info && !error && !success && (
              <>
                <FaInfoCircle className="flex-shrink-0 h-4 w-4 mt-0.5 text-blue-500" />
                <p className="ml-2 text-sm text-blue-600 dark:text-blue-400">{info}</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputField;