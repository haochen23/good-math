import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Calculator, Sparkles, ListChecks, Infinity as InfinityIcon } from 'lucide-react';
import { LevelGrid } from '../components/quiz';
import { Button } from '../components/ui';
import SettingsModal from './SettingsModal';
import { soundManager } from '../utils/sounds';
import type { QuizMode } from '../types';

/**
 * Animation variants for page elements
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
 * HomePage Component
 * Main landing page with level selection
 */
const HomePage: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMode, setSelectedMode] = useState<QuizMode>('standard');

  // Initialize sound manager on user interaction
  const handleInteraction = () => {
    soundManager.init();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={handleInteraction}
    >
      {/* Header */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center">
        <div className="w-10" /> {/* Spacer for centering */}
        
        <motion.div
          className="flex items-center gap-2"
          variants={itemVariants}
        >
          <Calculator className="w-6 h-6 md:w-8 md:h-8 text-primary-500" />
          <span className="font-display text-xl md:text-2xl text-gray-800">
            Good Math
          </span>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
        {/* Title Section */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary-400" />
            <h1 className="text-4xl md:text-6xl font-display text-gray-800">
              Good Math
            </h1>
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary-400" />
          </motion.div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
            Learn addition and subtraction with fun animated puzzles! 🎯
          </p>
        </motion.div>

        {/* Mode Selection Tabs */}
        <motion.div
          className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl"
          variants={itemVariants}
        >
          <button
            onClick={() => setSelectedMode('standard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedMode === 'standard'
                ? 'bg-white text-primary-600 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ListChecks className="w-5 h-5" />
            <span>Standard Quiz</span>
          </button>
          <button
            onClick={() => setSelectedMode('unlimited')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              selectedMode === 'unlimited'
                ? 'bg-white text-secondary-600 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <InfinityIcon className="w-5 h-5" />
            <span>Unlimited Mode</span>
          </button>
        </motion.div>

        {/* Mode Description */}
        <motion.p
          className="text-sm text-gray-500 mb-4 text-center max-w-md"
          variants={itemVariants}
        >
          {selectedMode === 'standard' 
            ? '📝 Answer a set number of questions and see your results!'
            : '♾️ Practice as long as you want - end anytime!'}
        </motion.p>

        {/* Choose a Level */}
        <motion.h2
          className="text-xl md:text-2xl font-bold text-gray-700 mb-6"
          variants={itemVariants}
        >
          Choose a Level
        </motion.h2>

        {/* Level Selection Grid */}
        <motion.div variants={itemVariants} className="w-full max-w-4xl">
          <LevelGrid mode={selectedMode} />
        </motion.div>

        {/* Fun fact or tip */}
        <motion.div
          className="mt-10 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm md:text-base">
            💡 Tip: Start with "Numbers to 10" if you're just beginning!
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400 text-sm">
        <motion.p variants={itemVariants}>
          Made with ❤️ for young learners
        </motion.p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </motion.div>
  );
};

export default HomePage;
