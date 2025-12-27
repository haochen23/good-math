import React from 'react';
import { motion } from 'framer-motion';

/**
 * Progress Bar color variants
 */
export type ProgressColor = 'primary' | 'secondary' | 'accent' | 'success' | 'rainbow';

/**
 * Progress Bar size variants
 */
export type ProgressSize = 'sm' | 'md' | 'lg';

/**
 * ProgressBar Props Interface
 */
interface ProgressBarProps {
  /** Current progress value (0-100) */
  value: number;
  /** Maximum value (defaults to 100) */
  max?: number;
  /** Color variant */
  color?: ProgressColor;
  /** Size variant */
  size?: ProgressSize;
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Whether to animate the progress */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Color gradient mapping
 */
const colorGradients: Record<ProgressColor, string> = {
  primary: 'from-primary-400 to-primary-600',
  secondary: 'from-secondary-400 to-secondary-600',
  accent: 'from-accent-400 to-accent-600',
  success: 'from-green-400 to-green-600',
  rainbow: 'from-fun-pink via-fun-purple to-accent-500',
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ProgressSize, { height: string; fontSize: string }> = {
  sm: { height: 'h-2', fontSize: 'text-xs' },
  md: { height: 'h-4', fontSize: 'text-sm' },
  lg: { height: 'h-6', fontSize: 'text-base' },
};

/**
 * ProgressBar Component
 * A colorful, animated progress indicator
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const { height, fontSize } = sizeStyles[size];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between mb-1 ${fontSize} font-semibold text-gray-600`}>
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`
          w-full ${height} 
          bg-gray-200 rounded-full 
          overflow-hidden
          shadow-inner
        `}
      >
        <motion.div
          className={`
            h-full rounded-full
            bg-gradient-to-r ${colorGradients[color]}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 0.5, ease: 'easeOut' }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
};

/**
 * Circular Progress Component
 */
interface CircularProgressProps {
  /** Current progress value (0-100) */
  value: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color variant */
  color?: ProgressColor;
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showLabel = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color mapping for circular progress
  const colorMap: Record<ProgressColor, string> = {
    primary: '#f9ae19',
    secondary: '#4caf50',
    accent: '#2196f3',
    success: '#4caf50',
    rainbow: '#9c27b0',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
