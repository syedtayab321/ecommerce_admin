import React from 'react';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  hoverEffect = 'grow',
  animation = true,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden';
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-2.5 text-base',
    large: 'px-8 py-3 text-lg'
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
    pill: 'rounded-full'
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 focus:ring-indigo-300/50 shadow-md hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 hover:from-gray-200 hover:to-gray-100 focus:ring-gray-300/50 dark:from-gray-700 dark:to-gray-600 dark:text-white dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-sm',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-300/50 shadow-md hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 focus:ring-green-300/50 shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300/50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300/50 dark:text-gray-300 dark:hover:bg-gray-700',
    premium: 'bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:from-amber-600 hover:to-amber-500 focus:ring-amber-300/50 shadow-lg hover:shadow-xl'
  };
  
  const hoverEffects = {
    grow: 'hover:scale-[1.03]',
    lift: 'hover:-translate-y-0.5',
    none: ''
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const ButtonContent = (
    <>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? 'text-gray-500' : 'text-white'} 
          />
        </span>
      )}
      <span className={`inline-flex items-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {startIcon && <span className="mr-2">{startIcon}</span>}
        {children}
        {endIcon && <span className="ml-2">{endIcon}</span>}
      </span>
    </>
  );
  
  return animation ? (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
      className={`${baseClasses} ${sizeClasses[size]} ${roundedClasses[rounded]} ${variantClasses[variant]} ${hoverEffects[hoverEffect]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {ButtonContent}
    </motion.button>
  ) : (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${roundedClasses[rounded]} ${variantClasses[variant]} ${hoverEffects[hoverEffect]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {ButtonContent}
    </button>
  );
};

export default Button;