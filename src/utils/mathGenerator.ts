import type { MathProblem, Operation, QuizLevel } from '../types';
import { LEVEL_CONFIGS } from '../types';

/**
 * Generates a unique ID for a problem
 */
const generateId = (): string => {
    return `problem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Gets a random integer between min and max (inclusive)
 */
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Randomly selects an operation from the available operations
 */
const getRandomOperation = (operations: Operation[]): Operation => {
    const index = Math.floor(Math.random() * operations.length);
    return operations[index];
};

/**
 * Checks if a number requires carrying in addition
 */
const checkRequiresCarry = (a: number, b: number, operation: Operation): boolean => {
    if (operation === 'addition') {
        // Check if ones place addition >= 10
        const onesA = a % 10;
        const onesB = b % 10;
        return onesA + onesB >= 10;
    } else {
        // Check if borrowing is needed (ones of first < ones of second)
        const onesA = a % 10;
        const onesB = b % 10;
        return onesA < onesB;
    }
};

/**
 * Generates a single addition problem
 */
const generateAdditionProblem = (maxNumber: number): MathProblem => {
    // For addition, both operands should be such that their sum <= maxNumber
    const operand1 = getRandomInt(0, maxNumber);
    const maxOperand2 = maxNumber - operand1;
    const operand2 = getRandomInt(0, maxOperand2);

    const answer = operand1 + operand2;
    const requiresCarry = checkRequiresCarry(operand1, operand2, 'addition');

    return {
        id: generateId(),
        operand1,
        operand2,
        operation: 'addition',
        answer,
        requiresCarry,
    };
};

/**
 * Generates a single subtraction problem
 * Ensures the result is always non-negative
 */
const generateSubtractionProblem = (maxNumber: number): MathProblem => {
    // First operand should be larger or equal to second
    const operand1 = getRandomInt(0, maxNumber);
    const operand2 = getRandomInt(0, operand1);

    const answer = operand1 - operand2;
    const requiresCarry = checkRequiresCarry(operand1, operand2, 'subtraction');

    return {
        id: generateId(),
        operand1,
        operand2,
        operation: 'subtraction',
        answer,
        requiresCarry,
    };
};

/**
 * Generates a single math problem based on level configuration
 */
export const generateProblem = (level: QuizLevel): MathProblem => {
    const config = LEVEL_CONFIGS[level];
    const operation = getRandomOperation(config.operations);

    if (operation === 'addition') {
        return generateAdditionProblem(config.maxNumber);
    } else {
        return generateSubtractionProblem(config.maxNumber);
    }
};

/**
 * Checks if two problems are duplicates
 */
const isDuplicateProblem = (a: MathProblem, b: MathProblem): boolean => {
    return (
        a.operand1 === b.operand1 &&
        a.operand2 === b.operand2 &&
        a.operation === b.operation
    );
};

/**
 * Generates a complete quiz with the specified number of problems
 * Avoids consecutive duplicate problems
 */
export const generateQuiz = (level: QuizLevel, count: number): MathProblem[] => {
    const problems: MathProblem[] = [];
    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loops

    while (problems.length < count && attempts < maxAttempts) {
        const newProblem = generateProblem(level);

        // Check if it's a duplicate of the last problem
        const lastProblem = problems[problems.length - 1];
        if (!lastProblem || !isDuplicateProblem(newProblem, lastProblem)) {
            // Also check it's not too similar to any recent problem
            const recentProblems = problems.slice(-3);
            const isDuplicate = recentProblems.some(p => isDuplicateProblem(p, newProblem));

            if (!isDuplicate) {
                problems.push(newProblem);
            }
        }

        attempts++;
    }

    // If we couldn't get enough unique problems, fill with any valid problems
    while (problems.length < count) {
        problems.push(generateProblem(level));
    }

    return problems;
};

/**
 * Formats a problem as a string for display
 */
export const formatProblem = (problem: MathProblem): string => {
    const operator = problem.operation === 'addition' ? '+' : '-';
    return `${problem.operand1} ${operator} ${problem.operand2}`;
};

/**
 * Gets the operation symbol
 */
export const getOperationSymbol = (operation: Operation): string => {
    return operation === 'addition' ? '+' : '−'; // Using proper minus sign
};

/**
 * Validates an answer
 */
export const validateAnswer = (problem: MathProblem, userAnswer: number): boolean => {
    return problem.answer === userAnswer;
};

/**
 * Calculates the score percentage
 */
export const calculatePercentage = (correct: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
};

/**
 * Formats time in milliseconds to a readable string
 */
export const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
};

/**
 * Gets digits of a number as an array (from right to left)
 */
export const getDigits = (num: number): number[] => {
    if (num === 0) return [0];
    const digits: number[] = [];
    let n = Math.abs(num);
    while (n > 0) {
        digits.push(n % 10);
        n = Math.floor(n / 10);
    }
    return digits;
};

/**
 * Pads digits array to a specific length
 */
export const padDigits = (digits: number[], length: number): (number | null)[] => {
    const padded: (number | null)[] = [...digits];
    while (padded.length < length) {
        padded.push(null);
    }
    return padded;
};
