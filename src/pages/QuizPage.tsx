import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, StopCircle, CheckCircle2 } from 'lucide-react';
import { Button, ProgressBar, Card } from '../components/ui';
import { NumberPad, ProblemDisplay } from '../components/quiz';
import { VerticalCalculation, Celebration } from '../components/animations';
import { useQuizStore, useQuizMode, useTotalAnswered, useCorrectInSession } from '../stores/quizStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { QuizLevel, QuizMode } from '../types';
import { LEVEL_CONFIGS } from '../types';
import { playSound } from '../utils/sounds';

/**
 * Quiz flow states
 */
type QuizFlowState = 'answering' | 'showing-solution' | 'celebrating' | 'transitioning';

/**
 * QuizPage Component
 * Main quiz interaction page - supports both standard and unlimited modes
 */
const QuizPage: React.FC = () => {
    const { level } = useParams<{ level: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get mode from query params (default to 'standard')
    const modeParam = (searchParams.get('mode') || 'standard') as QuizMode;

    // Store hooks
    const {
        problems,
        currentIndex,
        isComplete,
        startQuiz,
        submitAnswer,
        nextProblem,
        getCurrentProblem,
        resetQuiz,
        endUnlimitedSession,
    } = useQuizStore();

    const quizMode = useQuizMode();
    const totalAnswered = useTotalAnswered();
    const correctInSession = useCorrectInSession();
    const { questionsPerQuiz, animationSpeed } = useSettingsStore();

    // Local state
    const [userInput, setUserInput] = useState('');
    const [flowState, setFlowState] = useState<QuizFlowState>('answering');
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Get current problem
    const currentProblem = getCurrentProblem();

    // Level configuration
    const levelConfig = level ? LEVEL_CONFIGS[level as QuizLevel] : null;

    // Is this unlimited mode?
    const isUnlimited = quizMode === 'unlimited';

    /**
     * Initialize quiz when page loads
     */
    useEffect(() => {
        if (level && Object.keys(LEVEL_CONFIGS).includes(level)) {
            startQuiz(level as QuizLevel, questionsPerQuiz, modeParam);
        } else {
            navigate('/');
        }

        return () => {
            // Don't reset on unmount - we might be going to results
        };
    }, [level, questionsPerQuiz, startQuiz, navigate, modeParam]);

    /**
     * Navigate to results when quiz completes (only for standard mode)
     */
    useEffect(() => {
        if (isComplete && !isUnlimited) {
            // Small delay to let the last celebration show
            const timeout = setTimeout(() => {
                navigate('/results');
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [isComplete, navigate, isUnlimited]);

    /**
     * Handle answer submission
     */
    const handleSubmit = useCallback(() => {
        if (!currentProblem || flowState !== 'answering') return;
        if (userInput === '') return;

        const answer = parseInt(userInput, 10);
        const isCorrect = submitAnswer(answer);

        setLastAnswerCorrect(isCorrect);
        setFlowState('showing-solution');

        // Play sound feedback
        playSound(isCorrect ? 'correct' : 'incorrect');
    }, [currentProblem, userInput, flowState, submitAnswer]);

    /**
     * Handle vertical calculation animation complete
     */
    const handleAnimationComplete = useCallback(() => {
        setFlowState('celebrating');
    }, []);

    /**
     * Handle celebration complete - move to next problem
     */
    const handleCelebrationComplete = useCallback(() => {
        setFlowState('transitioning');
        setUserInput('');

        // Brief delay before showing next problem
        setTimeout(() => {
            nextProblem();
            setFlowState('answering');
        }, 300);
    }, [nextProblem]);

    /**
     * Handle back/exit button
     */
    const handleBack = () => {
        if (flowState === 'answering' && (currentIndex > 0 || totalAnswered > 0)) {
            setShowExitConfirm(true);
        } else {
            resetQuiz();
            navigate('/');
        }
    };

    /**
     * Handle end unlimited session
     */
    const handleEndSession = () => {
        endUnlimitedSession();
        navigate('/results');
    };

    /**
     * Confirm exit
     */
    const confirmExit = () => {
        resetQuiz();
        navigate('/');
    };

    // Show loading if no problem yet
    if (!currentProblem || !levelConfig) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    className="text-2xl text-gray-500"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-accent-50">
            {/* Header */}
            <header className="w-full p-4 flex justify-between items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                >
                    <span className="hidden sm:inline">Back</span>
                </Button>

                <div className="text-center">
                    <h1 className="text-lg md:text-xl font-bold text-gray-700">
                        {levelConfig.name}
                    </h1>
                    {isUnlimited && (
                        <p className="text-sm text-secondary-500 font-medium">
                            ∞ Unlimited Mode
                        </p>
                    )}
                </div>

                {isUnlimited ? (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleEndSession}
                        leftIcon={<StopCircle className="w-5 h-5" />}
                        disabled={flowState !== 'answering'}
                    >
                        <span className="hidden sm:inline">End</span>
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/')}
                    >
                        <Home className="w-5 h-5" />
                    </Button>
                )}
            </header>

            {/* Progress Bar / Stats */}
            <div className="px-4 md:px-8">
                {isUnlimited ? (
                    <div className="flex items-center justify-center gap-6 py-2 bg-white/50 rounded-full px-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-secondary-500" />
                            <span className="text-lg font-bold text-secondary-600">{correctInSession}</span>
                            <span className="text-sm text-gray-500">correct</span>
                        </div>
                        <div className="w-px h-6 bg-gray-300" />
                        <div className="text-center">
                            <span className="text-lg font-bold text-primary-600">{totalAnswered}</span>
                            <span className="text-sm text-gray-500 ml-1">total</span>
                        </div>
                        {totalAnswered > 0 && (
                            <>
                                <div className="w-px h-6 bg-gray-300" />
                                <div className="text-center">
                                    <span className="text-lg font-bold text-accent-500">
                                        {Math.round((correctInSession / totalAnswered) * 100)}%
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <ProgressBar
                        value={currentIndex}
                        max={problems.length}
                        color="primary"
                        size="md"
                        showLabel
                        animated
                    />
                )}
            </div>

            {/* Main Quiz Area */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
                <AnimatePresence mode="wait">
                    {flowState === 'answering' && (
                        <motion.div
                            key="answering"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-lg flex flex-col items-center gap-8"
                        >
                            {/* Problem Display */}
                            <ProblemDisplay
                                problem={currentProblem}
                                userInput={userInput}
                                currentNumber={isUnlimited ? totalAnswered + 1 : currentIndex + 1}
                                totalProblems={isUnlimited ? undefined : problems.length}
                            />

                            {/* Number Pad */}
                            <NumberPad
                                value={userInput}
                                onChange={setUserInput}
                                onSubmit={handleSubmit}
                                maxDigits={levelConfig.maxNumber >= 1000 ? 4 : levelConfig.maxNumber >= 100 ? 3 : 2}
                                disabled={flowState !== 'answering'}
                            />
                        </motion.div>
                    )}

                    {(flowState === 'showing-solution' || flowState === 'celebrating') && (
                        <motion.div
                            key="solution"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-lg flex flex-col items-center"
                        >
                            <VerticalCalculation
                                problem={currentProblem}
                                isCorrect={lastAnswerCorrect}
                                animationSpeed={animationSpeed}
                                onComplete={handleAnimationComplete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Celebration overlay */}
            <Celebration
                show={flowState === 'celebrating'}
                isCorrect={lastAnswerCorrect}
                onComplete={handleCelebrationComplete}
                duration={lastAnswerCorrect ? 2000 : 1500}
            />

            {/* Exit confirmation modal */}
            <AnimatePresence>
                {showExitConfirm && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowExitConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card padding="lg" className="max-w-sm text-center">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Leave Quiz?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Your progress will be lost if you leave now.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowExitConfirm(false)}
                                    >
                                        Stay
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={confirmExit}
                                    >
                                        Leave
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizPage;
