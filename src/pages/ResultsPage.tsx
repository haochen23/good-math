import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RotateCcw, Trophy, Target, Clock, Infinity as InfinityIcon } from 'lucide-react';
import { Button, Card, CircularProgress } from '../components/ui';
import { CompactProblem } from '../components/quiz';
import { Celebration } from '../components/animations';
import { useQuizStore, useQuizMode } from '../stores/quizStore';
import type { QuizLevel } from '../types';
import { LEVEL_CONFIGS } from '../types';
import { formatTime } from '../utils/mathGenerator';
import { playSound } from '../utils/sounds';
import { SCORE_THRESHOLDS, COMPLETION_MESSAGES } from '../constants';

/**
 * Animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * Get random completion message based on score
 */
const getCompletionMessage = (percentage: number): string => {
  let messages: readonly string[];
  
  if (percentage >= SCORE_THRESHOLDS.excellent) {
    messages = COMPLETION_MESSAGES.excellent;
  } else if (percentage >= SCORE_THRESHOLDS.good) {
    messages = COMPLETION_MESSAGES.good;
  } else {
    messages = COMPLETION_MESSAGES.needsPractice;
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * ResultsPage Component
 * Quiz results summary page
 */
const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { level, getResults, resetQuiz, isComplete } = useQuizStore();
  const quizMode = useQuizMode();
  
  // Get results
  const results = useMemo(() => getResults(), [getResults]);
  const levelConfig = level ? LEVEL_CONFIGS[level as QuizLevel] : null;
  const isUnlimited = quizMode === 'unlimited';
  
  // Redirect if no quiz was completed
  useEffect(() => {
    if (!isComplete || !level) {
      navigate('/');
    }
  }, [isComplete, level, navigate]);

  // Play completion sound
  useEffect(() => {
    if (results.percentage >= SCORE_THRESHOLDS.excellent) {
      playSound('complete');
    } else if (results.percentage >= SCORE_THRESHOLDS.good) {
      playSound('levelUp');
    }
  }, [results.percentage]);

  /**
   * Handle try again - restart quiz at same level
   */
  const handleTryAgain = () => {
    const currentLevel = level;
    const currentMode = quizMode;
    resetQuiz();
    navigate(`/quiz/${currentLevel}${currentMode === 'unlimited' ? '?mode=unlimited' : ''}`);
  };

  /**
   * Handle go home
   */
  const handleGoHome = () => {
    resetQuiz();
    navigate('/');
  };

  // Get completion message
  const completionMessage = useMemo(
    () => getCompletionMessage(results.percentage),
    [results.percentage]
  );

  // Determine score color
  const getScoreColor = (): 'success' | 'accent' | 'primary' => {
    if (results.percentage >= SCORE_THRESHOLDS.excellent) return 'success';
    if (results.percentage >= SCORE_THRESHOLDS.good) return 'accent';
    return 'primary';
  };

  if (!levelConfig) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-accent-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Celebration for high scores */}
      <Celebration
        show={results.percentage >= SCORE_THRESHOLDS.excellent}
        isCorrect={true}
        duration={3000}
      />

      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoHome}
          leftIcon={<Home className="w-5 h-5" />}
        >
          Home
        </Button>
        
        <h1 className="text-xl font-bold text-gray-700">
          {levelConfig.name}
        </h1>
        
        <div className="w-20" /> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 md:py-10">
        {/* Trophy and Message */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.6,
              delay: 0.5,
            }}
          >
            {isUnlimited ? (
              <InfinityIcon
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-secondary-500"
              />
            ) : (
              <Trophy
                className={`w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 ${
                  results.percentage >= SCORE_THRESHOLDS.excellent
                    ? 'text-yellow-400'
                    : results.percentage >= SCORE_THRESHOLDS.good
                    ? 'text-secondary-500'
                    : 'text-accent-500'
                }`}
              />
            )}
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {isUnlimited ? 'Practice Session Complete!' : 'Quiz Complete!'}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600">
            {completionMessage}
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div variants={itemVariants} className="w-full max-w-md">
          <Card padding="lg" className="text-center mb-6">
            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <CircularProgress
                value={results.percentage}
                size={140}
                strokeWidth={10}
                color={getScoreColor()}
              />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-secondary-500 mb-1">
                  <Target className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {results.correctCount}
                </p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                  <Target className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {results.incorrectCount}
                </p>
                <p className="text-sm text-gray-500">Incorrect</p>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 text-accent-500 mb-1">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {formatTime(results.totalTime)}
                </p>
                <p className="text-sm text-gray-500">Time</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Problem Review */}
        <motion.div variants={itemVariants} className="w-full max-w-md">
          <h3 className="text-lg font-bold text-gray-700 mb-3">
            Review Your Answers
          </h3>
          
          <Card padding="md" className="max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {results.detailedResults.map((result) => (
                <CompactProblem
                  key={result.problem.id}
                  problem={result.problem}
                  userAnswer={result.userAnswer}
                  isCorrect={result.isCorrect}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md"
          variants={itemVariants}
        >
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleTryAgain}
            leftIcon={<RotateCcw className="w-5 h-5" />}
          >
            Try Again
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleGoHome}
            leftIcon={<Home className="w-5 h-5" />}
          >
            Choose Level
          </Button>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default ResultsPage;
