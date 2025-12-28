import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

/**
 * Card variant types
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'interactive';

/**
 * Card color accents
 */
export type CardColor = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning';

/**
 * Card Props Interface
 */
interface CardProps extends HTMLMotionProps<'div'> {
    /** Visual style variant */
    variant?: CardVariant;
    /** Color accent */
    color?: CardColor;
    /** Padding size */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Whether the card is clickable */
    onClick?: () => void;
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white shadow-soft',
    elevated: 'bg-white shadow-medium',
    outlined: 'bg-white border-2 border-gray-200',
    interactive: 'bg-white shadow-soft hover:shadow-medium cursor-pointer',
};

/**
 * Color accent styles mapping
 */
const colorStyles: Record<CardColor, string> = {
    default: '',
    primary: 'border-l-4 border-l-primary-500',
    secondary: 'border-l-4 border-l-secondary-500',
    accent: 'border-l-4 border-l-accent-500',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
};

/**
 * Padding styles mapping
 */
const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
};

/**
 * Card Component
 * A versatile card container with multiple variants and colors
 */
export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    color = 'default',
    padding = 'md',
    onClick,
    className = '',
    ...props
}) => {
    const isInteractive = variant === 'interactive' || !!onClick;

    const baseStyles = `
    rounded-3xl
    overflow-hidden
  `;

    return (
        <motion.div
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${colorStyles[color]}
        ${paddingStyles[padding]}
        ${className}
      `.trim()}
            onClick={onClick}
            whileHover={isInteractive ? { scale: 1.02, y: -4 } : undefined}
            whileTap={isInteractive ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
