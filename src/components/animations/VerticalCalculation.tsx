import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MathProblem, AnimationSpeed } from '../../types';
import { ANIMATION_SPEEDS } from '../../types';
import { getDigits, padDigits, getOperationSymbol } from '../../utils/mathGenerator';
import {
    speechManager,
    getAdditionSpeechText,
    getSubtractionSpeechText,
    getCompletionSpeech
} from '../../utils/speech';
import { useSettingsStore } from '../../stores/settingsStore';

/**
 * VerticalCalculation Props Interface
 */
interface VerticalCalculationProps {
    /** The math problem to animate */
    problem: MathProblem;
    /** Whether the user's answer was correct */
    isCorrect: boolean;
    /** Animation speed setting */
    animationSpeed?: AnimationSpeed;
    /** Callback when animation completes */
    onComplete?: () => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Place names for educational display
 */
const PLACE_NAMES = ['ones', 'tens', 'hundreds', 'thousands'];

/**
 * Get base duration multiplied by speed factor
 */
const getDuration = (base: number, speed: AnimationSpeed): number => {
    return base * ANIMATION_SPEEDS[speed];
};

/**
 * Calculate column-by-column details for addition
 */
interface ColumnCalc {
    placeIndex: number;      // 0 = ones, 1 = tens, etc.
    placeName: string;
    op1Digit: number;
    op2Digit: number;
    carryIn: number;         // Carry from previous column
    sum: number;             // Total before splitting
    resultDigit: number;     // Digit written in this place
    carryOut: number;        // Carry to next column
}

/**
 * Calculate column-by-column details for subtraction
 */
interface SubtractionColumnCalc {
    placeIndex: number;
    placeName: string;
    op1Digit: number;
    op2Digit: number;
    borrowIn: number;        // Borrow from higher place affects this digit
    needsBorrow: boolean;    // Need to borrow from next place
    borrowedValue: number;   // Value after borrowing (op1Digit + 10 if borrowed)
    resultDigit: number;
}

/**
 * VerticalCalculation Component
 * Animated vertical calculation display showing step-by-step solution with explanations
 * Supports any number of digits
 */
export const VerticalCalculation: React.FC<VerticalCalculationProps> = ({
    problem,
    isCorrect,
    animationSpeed = 'normal',
    onComplete,
    className = '',
}) => {
    // Get speech setting
    const speechEnabled = useSettingsStore(state => state.speechEnabled);

    // Current column being animated (0 = ones, 1 = tens, etc.)
    const [currentColumn, setCurrentColumn] = useState(-1);
    // Animation phase within current column
    const [phase, setPhase] = useState<'highlight' | 'calc' | 'carry' | 'write'>('highlight');
    // Whether animation is complete
    const [isDone, setIsDone] = useState(false);
    // Result digits that have been written
    const [writtenDigits, setWrittenDigits] = useState<number[]>([]);

    // Calculate all column details
    const { columns, maxDigits, op1Digits, op2Digits, resultDigits } = useMemo(() => {
        const op1 = getDigits(problem.operand1);
        const op2 = getDigits(problem.operand2);
        const result = getDigits(problem.answer);
        const max = Math.max(op1.length, op2.length, result.length);

        const paddedOp1 = padDigits(op1, max);
        const paddedOp2 = padDigits(op2, max);
        const paddedResult = padDigits(result, max);

        if (problem.operation === 'addition') {
            const cols: ColumnCalc[] = [];
            let carryIn = 0;

            for (let i = 0; i < max; i++) {
                const d1 = paddedOp1[i] ?? 0;
                const d2 = paddedOp2[i] ?? 0;
                const sum = d1 + d2 + carryIn;
                const resultDigit = sum % 10;
                const carryOut = Math.floor(sum / 10);

                cols.push({
                    placeIndex: i,
                    placeName: PLACE_NAMES[i] || `place ${i}`,
                    op1Digit: d1,
                    op2Digit: d2,
                    carryIn,
                    sum,
                    resultDigit,
                    carryOut,
                });

                carryIn = carryOut;
            }

            return {
                columns: cols,
                maxDigits: max,
                op1Digits: paddedOp1,
                op2Digits: paddedOp2,
                resultDigits: paddedResult
            };
        } else {
            // Subtraction
            const cols: SubtractionColumnCalc[] = [];
            let borrowIn = 0;

            for (let i = 0; i < max; i++) {
                const d1 = (paddedOp1[i] ?? 0) - borrowIn;
                const d2 = paddedOp2[i] ?? 0;
                const needsBorrow = d1 < d2;
                const borrowedValue = needsBorrow ? d1 + 10 : d1;
                const resultDigit = borrowedValue - d2;

                cols.push({
                    placeIndex: i,
                    placeName: PLACE_NAMES[i] || `place ${i}`,
                    op1Digit: paddedOp1[i] ?? 0,
                    op2Digit: d2,
                    borrowIn,
                    needsBorrow,
                    borrowedValue,
                    resultDigit,
                });

                borrowIn = needsBorrow ? 1 : 0;
            }

            return {
                columns: cols,
                maxDigits: max,
                op1Digits: paddedOp1,
                op2Digits: paddedOp2,
                resultDigits: paddedResult
            };
        }
    }, [problem]);

    /**
     * Speak text and wait for it to complete, or use minimum timing
     */
    const speakAndWait = async (text: string, minWait: number): Promise<void> => {
        if (speechEnabled && text) {
            // Speech rate adjusted by animation speed
            const rate = animationSpeed === 'slow' ? 0.9 : animationSpeed === 'fast' ? 1.3 : 1.0;
            const speechDuration = await speechManager.speak(text, rate);
            // Wait at least the minimum time, or speech duration + small buffer
            const waitTime = Math.max(minWait, speechDuration + 200);
            await new Promise(r => setTimeout(r, waitTime - speechDuration));
        } else {
            await new Promise(r => setTimeout(r, minWait));
        }
    };

    // Animation sequence with speech
    useEffect(() => {
        const baseTiming = getDuration(600, animationSpeed);
        let cancelled = false;

        const runAnimation = async () => {
            // Stop any previous speech
            speechManager.stop();

            // Initial delay
            await new Promise(r => setTimeout(r, baseTiming));
            if (cancelled) return;

            // Animate each column
            for (let col = 0; col < maxDigits; col++) {
                if (cancelled) return;

                setCurrentColumn(col);
                const column = columns[col];

                // Get speech text for each phase
                let highlightText = '';
                let calcText = '';
                let carryText = '';
                let writeText = '';

                if (problem.operation === 'addition') {
                    const c = column as ColumnCalc;
                    highlightText = getAdditionSpeechText('highlight', c.placeName, c.op1Digit, c.op2Digit, c.carryIn, c.sum, c.resultDigit, c.carryOut);
                    calcText = getAdditionSpeechText('calc', c.placeName, c.op1Digit, c.op2Digit, c.carryIn, c.sum, c.resultDigit, c.carryOut);
                    carryText = getAdditionSpeechText('carry', c.placeName, c.op1Digit, c.op2Digit, c.carryIn, c.sum, c.resultDigit, c.carryOut);
                    writeText = getAdditionSpeechText('write', c.placeName, c.op1Digit, c.op2Digit, c.carryIn, c.sum, c.resultDigit, c.carryOut);
                } else {
                    const c = column as SubtractionColumnCalc;
                    highlightText = getSubtractionSpeechText('highlight', c.placeName, c.op1Digit, c.op2Digit, c.borrowIn, c.needsBorrow, c.borrowedValue, c.resultDigit);
                    calcText = getSubtractionSpeechText('calc', c.placeName, c.op1Digit, c.op2Digit, c.borrowIn, c.needsBorrow, c.borrowedValue, c.resultDigit);
                    carryText = getSubtractionSpeechText('carry', c.placeName, c.op1Digit, c.op2Digit, c.borrowIn, c.needsBorrow, c.borrowedValue, c.resultDigit);
                    writeText = getSubtractionSpeechText('write', c.placeName, c.op1Digit, c.op2Digit, c.borrowIn, c.needsBorrow, c.borrowedValue, c.resultDigit);
                }

                // Highlight phase
                setPhase('highlight');
                await speakAndWait(highlightText, baseTiming);
                if (cancelled) return;

                // Calculate phase
                setPhase('calc');
                await speakAndWait(calcText, baseTiming * 1.5);
                if (cancelled) return;

                // Carry/borrow phase (if needed)
                const hasCarryOrBorrow = problem.operation === 'addition'
                    ? (column as ColumnCalc).carryOut > 0
                    : (column as SubtractionColumnCalc).needsBorrow;

                if (hasCarryOrBorrow) {
                    setPhase('carry');
                    await speakAndWait(carryText, baseTiming * 1.2);
                    if (cancelled) return;
                }

                // Write phase
                setPhase('write');
                setWrittenDigits(prev => [...prev, (column as ColumnCalc).resultDigit ?? (column as SubtractionColumnCalc).resultDigit]);
                if (writeText) {
                    await speakAndWait(writeText, baseTiming * 0.8);
                } else {
                    await new Promise(r => setTimeout(r, baseTiming * 0.8));
                }
                if (cancelled) return;
            }

            // Done - speak completion
            setIsDone(true);
            const completionText = getCompletionSpeech(isCorrect, problem.answer);
            await speakAndWait(completionText, baseTiming);
            if (cancelled) return;

            onComplete?.();
        };

        runAnimation();

        return () => {
            cancelled = true;
            speechManager.stop();
        };
    }, [problem.id, animationSpeed, maxDigits, columns, onComplete, problem.operation, speechEnabled, isCorrect, problem.answer]);

    // Reset when problem changes
    useEffect(() => {
        setCurrentColumn(-1);
        setPhase('highlight');
        setIsDone(false);
        setWrittenDigits([]);
        speechManager.stop();
    }, [problem.id]);

    const operationSymbol = getOperationSymbol(problem.operation);
    const currentCol = columns[currentColumn];

    // Calculate digit size based on number of digits
    const digitSize = maxDigits <= 2 ? 'text-4xl md:text-5xl' :
        maxDigits <= 3 ? 'text-3xl md:text-4xl' :
            'text-2xl md:text-3xl';
    const digitWidth = maxDigits <= 2 ? 'w-10 md:w-14' :
        maxDigits <= 3 ? 'w-8 md:w-12' :
            'w-7 md:w-10';

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            {/* Main vertical calculation */}
            <div className="vertical-calc relative bg-white rounded-3xl shadow-medium p-4 md:p-6">

                {/* Carry indicators for addition - shows above the column that receives the carry */}
                {problem.operation === 'addition' && (
                    <div className="flex justify-end mb-1 h-6">
                        <span className={`${digitWidth} text-center`}></span> {/* Spacer for operator */}
                        {[...Array(maxDigits)].map((_, i) => {
                            const colIndex = maxDigits - 1 - i;
                            // The carry to show above this column comes from the previous column (colIndex - 1)
                            const prevCol = columns[colIndex - 1] as ColumnCalc | undefined;
                            const showCarry = prevCol && prevCol.carryOut > 0 && (
                                colIndex - 1 < currentColumn ||
                                (colIndex - 1 === currentColumn && (phase === 'carry' || phase === 'write'))
                            );

                            return (
                                <AnimatePresence key={`carry-${i}`}>
                                    {showCarry ? (
                                        <motion.span
                                            className={`${digitWidth} text-center text-sm md:text-base text-primary-500 font-bold`}
                                            initial={{ opacity: 0, y: 10, scale: 0.5 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            +{prevCol.carryOut}
                                        </motion.span>
                                    ) : (
                                        <span className={`${digitWidth}`}></span>
                                    )}
                                </AnimatePresence>
                            );
                        })}
                    </div>
                )}

                {/* Borrow indicators for subtraction */}
                {problem.operation === 'subtraction' && (
                    <div className="flex justify-end mb-1 h-6">
                        <span className={`${digitWidth} text-center`}></span>
                        {[...Array(maxDigits)].map((_, i) => {
                            const colIndex = maxDigits - 1 - i;
                            const prevCol = columns[colIndex - 1] as SubtractionColumnCalc | undefined;
                            const showBorrow = prevCol && (
                                colIndex - 1 < currentColumn ||
                                (colIndex - 1 === currentColumn && (phase === 'carry' || phase === 'write'))
                            ) && prevCol.needsBorrow;

                            return (
                                <motion.span
                                    key={`borrow-${i}`}
                                    className={`${digitWidth} text-center text-xs md:text-sm text-accent-500 font-bold`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: showBorrow ? 1 : 0 }}
                                >
                                    {showBorrow ? '-1' : ''}
                                </motion.span>
                            );
                        })}
                    </div>
                )}

                {/* First operand */}
                <motion.div
                    className={`flex justify-end ${digitSize} text-gray-800 mb-2`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {[...op1Digits].reverse().map((digit, i) => {
                        const colIndex = maxDigits - 1 - i;
                        const isHighlighted = colIndex === currentColumn && phase === 'highlight';

                        return (
                            <motion.span
                                key={`op1-${i}`}
                                className={`${digitWidth} text-center rounded-lg transition-all duration-300 ${isHighlighted ? 'bg-yellow-200 text-yellow-800 scale-110' : ''
                                    }`}
                            >
                                {digit !== null ? digit : ''}
                            </motion.span>
                        );
                    })}
                </motion.div>

                {/* Operator and second operand row */}
                <motion.div
                    className={`flex justify-end items-center ${digitSize} mb-2`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className={`${digitWidth} text-center ${problem.operation === 'addition' ? 'text-secondary-500' : 'text-accent-500'
                        }`}>
                        {operationSymbol}
                    </span>
                    {[...op2Digits].reverse().map((digit, i) => {
                        const colIndex = maxDigits - 1 - i;
                        const isHighlighted = colIndex === currentColumn && phase === 'highlight';

                        return (
                            <motion.span
                                key={`op2-${i}`}
                                className={`${digitWidth} text-center text-gray-800 rounded-lg transition-all duration-300 ${isHighlighted ? 'bg-yellow-200 text-yellow-800 scale-110' : ''
                                    }`}
                            >
                                {digit !== null ? digit : ''}
                            </motion.span>
                        );
                    })}
                </motion.div>

                {/* Calculation line */}
                <div className="border-b-4 border-gray-800 mb-3" />

                {/* Result row */}
                <div className={`flex justify-end ${digitSize}`}>
                    <span className={`${digitWidth}`}></span>
                    {[...resultDigits].reverse().map((digit, i) => {
                        const colIndex = maxDigits - 1 - i;
                        const isWritten = writtenDigits.length > colIndex;

                        return (
                            <AnimatePresence key={`result-${i}`}>
                                {isWritten ? (
                                    <motion.span
                                        className={`${digitWidth} text-center ${isCorrect ? 'text-secondary-500' : 'text-accent-500'}`}
                                        initial={{ opacity: 0, scale: 0, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        {digit}
                                    </motion.span>
                                ) : (
                                    <span className={`${digitWidth}`}></span>
                                )}
                            </AnimatePresence>
                        );
                    })}
                </div>
            </div>

            {/* Step-by-step explanation bubble */}
            <AnimatePresence mode="wait">
                {currentColumn >= 0 && !isDone && currentCol && (
                    <motion.div
                        key={`${currentColumn}-${phase}`}
                        className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl px-4 py-3 shadow-soft max-w-md text-center"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        {problem.operation === 'addition' ? (
                            <AdditionExplanation
                                column={currentCol as ColumnCalc}
                                phase={phase}
                            />
                        ) : (
                            <SubtractionExplanation
                                column={currentCol as SubtractionColumnCalc}
                                phase={phase}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Final answer */}
            <AnimatePresence>
                {isDone && (
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <motion.div
                            className={`text-xl md:text-2xl font-bold ${isCorrect ? 'text-secondary-500' : 'text-red-500'
                                }`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, repeat: isCorrect ? 2 : 0 }}
                        >
                            {isCorrect ? (
                                <>
                                    <span className="text-2xl md:text-3xl">🎉</span>
                                    <span className="mx-2">Correct!</span>
                                    <span className="text-2xl md:text-3xl">🎉</span>
                                </>
                            ) : (
                                <>
                                    <p>The answer is {problem.answer}</p>
                                    <p className="text-base mt-1 text-gray-500">Keep going! 💪</p>
                                </>
                            )}
                        </motion.div>

                        <motion.p
                            className="mt-2 text-lg md:text-xl text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {problem.operand1} {operationSymbol} {problem.operand2} = {problem.answer}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Addition explanation component
 */
const AdditionExplanation: React.FC<{
    column: ColumnCalc;
    phase: string;
}> = ({ column, phase }) => {
    const { placeName, op1Digit, op2Digit, carryIn, sum, resultDigit, carryOut } = column;

    if (phase === 'highlight') {
        return (
            <div className="text-base md:text-lg text-gray-700">
                <span className="text-xl">👆</span>
                <p className="font-medium">
                    Look at the {placeName} place
                </p>
                <p className="text-primary-600 font-bold text-xl mt-1">
                    {op1Digit} and {op2Digit}
                    {carryIn > 0 && <span className="text-primary-500"> (+{carryIn} carried)</span>}
                </p>
            </div>
        );
    }

    if (phase === 'calc') {
        const expression = carryIn > 0
            ? `${op1Digit} + ${op2Digit} + ${carryIn}`
            : `${op1Digit} + ${op2Digit}`;

        return (
            <div className="text-base md:text-lg text-gray-700">
                <p className="font-medium">Add the {placeName}:</p>
                <p className="text-primary-600 font-bold text-xl mt-1">
                    {expression} = {sum}
                </p>
                {carryOut > 0 && (
                    <motion.p
                        className="text-accent-500 font-medium mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        ⚠️ {sum} ≥ 10, carry {carryOut}!
                    </motion.p>
                )}
            </div>
        );
    }

    if (phase === 'carry') {
        return (
            <div className="text-base md:text-lg text-gray-700">
                <p className="font-medium">Carry time!</p>
                <p className="text-primary-600 font-bold text-lg mt-1">
                    {sum} = <span className="text-accent-500">{carryOut}</span>0 + {resultDigit}
                </p>
                <p className="mt-1 text-sm">
                    Write <span className="text-secondary-500 font-bold">{resultDigit}</span>,
                    carry <span className="text-primary-500 font-bold">{carryOut}</span>
                </p>
            </div>
        );
    }

    // write phase
    return (
        <div className="text-base md:text-lg text-gray-700">
            <span className="text-xl">✍️</span>
            <p className="text-secondary-500 font-bold text-xl">
                Write {resultDigit} in {placeName}
            </p>
        </div>
    );
};

/**
 * Subtraction explanation component
 */
const SubtractionExplanation: React.FC<{
    column: SubtractionColumnCalc;
    phase: string;
}> = ({ column, phase }) => {
    const { placeName, op1Digit, op2Digit, borrowIn, needsBorrow, borrowedValue, resultDigit } = column;
    const effectiveOp1 = op1Digit - borrowIn;

    if (phase === 'highlight') {
        return (
            <div className="text-base md:text-lg text-gray-700">
                <span className="text-xl">👆</span>
                <p className="font-medium">
                    Look at the {placeName} place
                </p>
                <p className="text-primary-600 font-bold text-xl mt-1">
                    {borrowIn > 0 ? `${op1Digit} - ${borrowIn} = ${effectiveOp1}` : op1Digit} and {op2Digit}
                </p>
            </div>
        );
    }

    if (phase === 'calc') {
        if (needsBorrow) {
            return (
                <div className="text-base md:text-lg text-gray-700">
                    <p className="font-medium">Subtract the {placeName}:</p>
                    <p className="text-accent-500 font-medium mt-1">
                        {effectiveOp1} &lt; {op2Digit}, need to borrow!
                    </p>
                    <motion.p
                        className="text-secondary-600 font-bold text-lg mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Borrow 10 → {effectiveOp1} + 10 = {borrowedValue}
                    </motion.p>
                </div>
            );
        }

        return (
            <div className="text-base md:text-lg text-gray-700">
                <p className="font-medium">Subtract the {placeName}:</p>
                <p className="text-primary-600 font-bold text-xl mt-1">
                    {effectiveOp1} - {op2Digit} = {resultDigit}
                </p>
            </div>
        );
    }

    if (phase === 'carry') {
        return (
            <div className="text-base md:text-lg text-gray-700">
                <p className="font-medium">After borrowing:</p>
                <p className="text-primary-600 font-bold text-xl mt-1">
                    {borrowedValue} - {op2Digit} = {resultDigit}
                </p>
            </div>
        );
    }

    // write phase
    return (
        <div className="text-base md:text-lg text-gray-700">
            <span className="text-xl">✍️</span>
            <p className="text-secondary-500 font-bold text-xl">
                Write {resultDigit} in {placeName}
            </p>
        </div>
    );
};

export default VerticalCalculation;
