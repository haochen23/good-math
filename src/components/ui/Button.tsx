import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button Props Interface
 */
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether the button is in loading state */
  isLoading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Whether the button should take full width */
  fullWidth?: boolean;
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-soft hover:shadow-medium',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white shadow-soft hover:shadow-medium',
  accent: 'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white shadow-soft hover:shadow-medium',
  ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-soft hover:shadow-medium',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl min-h-[36px]',
  md: 'px-6 py-3 text-base rounded-2xl min-h-[44px]',
  lg: 'px-8 py-4 text-lg rounded-2xl min-h-[52px]',
  xl: 'px-10 py-5 text-xl rounded-3xl min-h-[64px]',
};

/**
 * Button Component
 * A child-friendly, animated button with multiple variants and sizes
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-bold
    transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    select-none
  `;

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {isLoading ? (
        <motion.span
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
