import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MathProblem } from '../../types';
import { getOperationSymbol } from '../../utils/mathGenerator';

/**
 * ProblemDisplay Props Interface
 */
interface ProblemDisplayProps {
    /** The math problem to display */
    problem: MathProblem;
    /** Current user input */
    userInput: string;
    /** Current problem number */
    currentNumber: number;
    /** Total problems (optional for unlimited mode) */
    totalProblems?: number;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Animation variants for problem entrance
 */
const problemVariants = {
    enter: {
        x: 50,
        opacity: 0,
        scale: 0.95,
    },
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
    exit: {
        x: -50,
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
            ease: 'easeIn',
        },
    },
};

/**
 * ProblemDisplay Component
 * Displays the current math problem in a large, readable format
 */
export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({
    problem,
    userInput,
    currentNumber,
    totalProblems,
    className = '',
}) => {
    const operationSymbol = getOperationSymbol(problem.operation);

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {/* Problem counter */}
            <motion.div
                className="mb-4 text-gray-500 font-semibold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {totalProblems ? `Question ${currentNumber} of ${totalProblems}` : `Question #${currentNumber}`}
            </motion.div>

            {/* Problem display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={problem.id}
                    variants={problemVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex items-center justify-center gap-4 md:gap-6"
                >
                    {/* First operand */}
                    <span className="number-display text-5xl md:text-7xl text-gray-800">
                        {problem.operand1}
                    </span>

                    {/* Operation symbol */}
                    <motion.span
                        className={`text-4xl md:text-6xl font-bold ${problem.operation === 'addition' ? 'text-secondary-500' : 'text-accent-500'
                            }`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.3 }}
                    >
                        {operationSymbol}
                    </motion.span>

                    {/* Second operand */}
                    <span className="number-display text-5xl md:text-7xl text-gray-800">
                        {problem.operand2}
                    </span>

                    {/* Equals sign */}
                    <span className="text-4xl md:text-6xl font-bold text-gray-400">
                        =
                    </span>

                    {/* Answer input display */}
                    <div
                        className={`
              number-display text-5xl md:text-7xl
              min-w-[80px] md:min-w-[120px]
              text-center
              border-b-4 border-primary-400
              ${userInput ? 'text-primary-600' : 'text-gray-300'}
            `}
                    >
                        {userInput || '?'}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Visual hint for young learners */}
            <motion.p
                className="mt-6 text-gray-400 text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Use the number pad to enter your answer
            </motion.p>
        </div>
    );
};

/**
 * Compact horizontal problem display for results page
 */
interface CompactProblemProps {
    problem: MathProblem;
    userAnswer: number | null;
    isCorrect: boolean;
}

export const CompactProblem: React.FC<CompactProblemProps> = ({
    problem,
    userAnswer,
    isCorrect,
}) => {
    const operationSymbol = getOperationSymbol(problem.operation);

    return (
        <div
            className={`
        flex items-center justify-between
        p-3 rounded-xl
        ${isCorrect ? 'bg-green-50' : 'bg-red-50'}
      `}
        >
            <div className="flex items-center gap-2 font-mono text-lg">
                <span>{problem.operand1}</span>
                <span className={problem.operation === 'addition' ? 'text-secondary-500' : 'text-accent-500'}>
                    {operationSymbol}
                </span>
                <span>{problem.operand2}</span>
                <span>=</span>
                <span className={isCorrect ? 'text-green-600' : 'text-red-500 line-through'}>
                    {userAnswer ?? '—'}
                </span>
                {!isCorrect && (
                    <span className="text-green-600 ml-2">({problem.answer})</span>
                )}
            </div>
            <span className="text-xl">
                {isCorrect ? '✓' : '✗'}
            </span>
        </div>
    );
};

export default ProblemDisplay;
