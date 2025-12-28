import React, { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Delete, Check, RotateCcw } from 'lucide-react';
import { playSound } from '../../utils/sounds';

/**
 * NumberPad Props Interface
 */
interface NumberPadProps {
    /** Current input value */
    value: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
    /** Callback when submit is pressed */
    onSubmit: () => void;
    /** Maximum digits allowed */
    maxDigits?: number;
    /** Whether the pad is disabled */
    disabled?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Number button configuration
 */
const numberLayout = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
];

/**
 * Button animation variants
 */
const buttonVariants = {
    tap: { scale: 0.9 },
    hover: { scale: 1.05 },
};

/**
 * NumberPad Component
 * A child-friendly on-screen number pad for answer input
 */
export const NumberPad: React.FC<NumberPadProps> = ({
    value,
    onChange,
    onSubmit,
    maxDigits = 2,
    disabled = false,
    className = '',
}) => {
    /**
     * Handles number button press
     */
    const handleNumberPress = useCallback(
        (num: number) => {
            if (disabled) return;
            if (value.length >= maxDigits) return;

            playSound('pop');

            // Don't allow leading zeros unless it's the only digit
            if (value === '0' && num === 0) return;
            if (value === '0' && num !== 0) {
                onChange(num.toString());
                return;
            }

            onChange(value + num.toString());
        },
        [value, maxDigits, disabled, onChange]
    );

    /**
     * Handles clear button press
     */
    const handleClear = useCallback(() => {
        if (disabled) return;
        playSound('click');
        onChange('');
    }, [disabled, onChange]);

    /**
     * Handles backspace button press
     */
    const handleBackspace = useCallback(() => {
        if (disabled) return;
        if (value.length === 0) return;
        playSound('click');
        onChange(value.slice(0, -1));
    }, [value, disabled, onChange]);

    /**
     * Handles submit button press
     */
    const handleSubmit = useCallback(() => {
        if (disabled) return;
        if (value.length === 0) return;
        playSound('click');
        onSubmit();
    }, [value, disabled, onSubmit]);

    /**
     * Keyboard support
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (disabled) return;

            // Number keys
            if (/^[0-9]$/.test(e.key)) {
                handleNumberPress(parseInt(e.key, 10));
            }
            // Backspace
            else if (e.key === 'Backspace') {
                handleBackspace();
            }
            // Enter
            else if (e.key === 'Enter') {
                handleSubmit();
            }
            // Escape to clear
            else if (e.key === 'Escape') {
                handleClear();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, handleNumberPress, handleBackspace, handleSubmit, handleClear]);

    /**
     * Base button styles
     */
    const baseButtonClass = `
    flex items-center justify-center
    w-16 h-16 md:w-20 md:h-20
    rounded-2xl
    font-bold text-2xl md:text-3xl
    transition-colors duration-150
    focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
    select-none
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

    const numberButtonClass = `
    ${baseButtonClass}
    bg-white hover:bg-gray-50 active:bg-gray-100
    text-gray-800
    shadow-soft
  `;

    const actionButtonClass = `
    ${baseButtonClass}
    text-white
  `;

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            {/* Number grid */}
            <div className="flex flex-col gap-3">
                {numberLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-3 justify-center">
                        {row.map((num) => (
                            <motion.button
                                key={num}
                                className={numberButtonClass}
                                onClick={() => handleNumberPress(num)}
                                disabled={disabled || value.length >= maxDigits}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                aria-label={`Number ${num}`}
                            >
                                {num}
                            </motion.button>
                        ))}
                    </div>
                ))}

                {/* Bottom row: Clear, 0, Backspace */}
                <div className="flex gap-3 justify-center">
                    <motion.button
                        className={`${actionButtonClass} bg-gray-400 hover:bg-gray-500 active:bg-gray-600`}
                        onClick={handleClear}
                        disabled={disabled}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Clear"
                    >
                        <RotateCcw className="w-6 h-6 md:w-7 md:h-7" />
                    </motion.button>

                    <motion.button
                        className={numberButtonClass}
                        onClick={() => handleNumberPress(0)}
                        disabled={disabled || value.length >= maxDigits}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Number 0"
                    >
                        0
                    </motion.button>

                    <motion.button
                        className={`${actionButtonClass} bg-red-400 hover:bg-red-500 active:bg-red-600`}
                        onClick={handleBackspace}
                        disabled={disabled || value.length === 0}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        aria-label="Backspace"
                    >
                        <Delete className="w-6 h-6 md:w-7 md:h-7" />
                    </motion.button>
                </div>
            </div>

            {/* Submit button */}
            <motion.button
                className={`
          flex items-center justify-center
          w-full max-w-[232px] md:max-w-[280px]
          min-h-[64px] px-8 py-4
          bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700
          text-white font-bold text-2xl md:text-3xl
          rounded-2xl shadow-medium
          transition-colors duration-150
          focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-2
          select-none
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
                onClick={handleSubmit}
                disabled={disabled || value.length === 0}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Submit answer"
            >
                <Check className="w-7 h-7 md:w-8 md:h-8 mr-2" />
                Check
            </motion.button>
        </div>
    );
};

export default NumberPad;
