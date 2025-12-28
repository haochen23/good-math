import React from 'react';
import { motion } from 'framer-motion';

/**
 * Badge variant types
 */
export type BadgeVariant = 'solid' | 'outline' | 'soft';

/**
 * Badge color types
 */
export type BadgeColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'gray';

/**
 * Badge size types
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Badge Props Interface
 */
interface BadgeProps {
    /** Badge content */
    children: React.ReactNode;
    /** Visual style variant */
    variant?: BadgeVariant;
    /** Color theme */
    color?: BadgeColor;
    /** Size variant */
    size?: BadgeSize;
    /** Icon to display */
    icon?: React.ReactNode;
    /** Whether to animate entrance */
    animated?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Solid variant color styles
 */
const solidColors: Record<BadgeColor, string> = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-secondary-500 text-white',
    accent: 'bg-accent-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
    gray: 'bg-gray-500 text-white',
};

/**
 * Outline variant color styles
 */
const outlineColors: Record<BadgeColor, string> = {
    primary: 'border-2 border-primary-500 text-primary-600 bg-transparent',
    secondary: 'border-2 border-secondary-500 text-secondary-600 bg-transparent',
    accent: 'border-2 border-accent-500 text-accent-600 bg-transparent',
    success: 'border-2 border-green-500 text-green-600 bg-transparent',
    warning: 'border-2 border-yellow-500 text-yellow-600 bg-transparent',
    danger: 'border-2 border-red-500 text-red-600 bg-transparent',
    gray: 'border-2 border-gray-500 text-gray-600 bg-transparent',
};

/**
 * Soft variant color styles
 */
const softColors: Record<BadgeColor, string> = {
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    accent: 'bg-accent-100 text-accent-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
};

/**
 * Badge Component
 * A small status indicator with multiple variants and colors
 */
export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'solid',
    color = 'primary',
    size = 'md',
    icon,
    animated = false,
    className = '',
}) => {
    const getColorStyles = () => {
        switch (variant) {
            case 'outline':
                return outlineColors[color];
            case 'soft':
                return softColors[color];
            default:
                return solidColors[color];
        }
    };

    const baseStyles = `
    inline-flex items-center gap-1
    font-semibold rounded-full
    whitespace-nowrap
  `;

    const Component = animated ? motion.span : 'span';
    const animationProps = animated
        ? {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { type: 'spring', stiffness: 500, damping: 25 },
        }
        : {};

    return (
        <Component
            className={`
        ${baseStyles}
        ${getColorStyles()}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
            {...animationProps}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </Component>
    );
};

/**
 * Star Rating Component
 * Displays a star rating for difficulty levels
 */
interface StarRatingProps {
    /** Number of filled stars (1-5) */
    rating: number;
    /** Maximum stars */
    max?: number;
    /** Star size */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS classes */
    className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    max = 3,
    size = 'md',
    className = '',
}) => {
    const starSizes: Record<'sm' | 'md' | 'lg', string> = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className={`flex gap-0.5 ${className}`}>
            {Array.from({ length: max }).map((_, index) => (
                <motion.svg
                    key={index}
                    className={`${starSizes[size]} ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                    }}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
            ))}
        </div>
    );
};

export default Badge;
