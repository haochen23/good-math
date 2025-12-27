import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Zap, HelpCircle, RotateCcw } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { useSettingsStore } from '../stores/settingsStore';
import type { AnimationSpeed } from '../types';

/**
 * SettingsModal Props Interface
 */
interface SettingsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
}

/**
 * Animation speed options
 */
const speedOptions: { value: AnimationSpeed; label: string; icon: string }[] = [
  { value: 'slow', label: 'Slow', icon: '🐢' },
  { value: 'normal', label: 'Normal', icon: '🚶' },
  { value: 'fast', label: 'Fast', icon: '🏃' },
];

/**
 * Question count options
 */
const questionOptions = [5, 10, 15, 20];

/**
 * Modal animation variants
 */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
};

/**
 * SettingsModal Component
 * App settings interface
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    soundEnabled,
    animationSpeed,
    questionsPerQuiz,
    showHints,
    toggleSound,
    setAnimationSpeed,
    setQuestionsPerQuiz,
    toggleHints,
    resetSettings,
  } = useSettingsStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card padding="lg">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Settings Content */}
              <div className="space-y-6">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-secondary-500" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">Sound Effects</p>
                      <p className="text-sm text-gray-500">
                        Play sounds for feedback
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`
                      relative w-14 h-8 rounded-full transition-colors duration-200
                      ${soundEnabled ? 'bg-secondary-500' : 'bg-gray-300'}
                    `}
                    aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
                  >
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                      animate={{ left: soundEnabled ? '1.75rem' : '0.25rem' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Animation Speed */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="font-semibold text-gray-800">Animation Speed</p>
                      <p className="text-sm text-gray-500">
                        How fast the solution appears
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {speedOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAnimationSpeed(option.value)}
                        className={`
                          flex-1 py-2 px-3 rounded-xl font-medium text-sm
                          transition-all duration-200
                          ${
                            animationSpeed === option.value
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        <span className="block text-lg mb-1">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions Per Quiz */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">📝</span>
                    <div>
                      <p className="font-semibold text-gray-800">Questions</p>
                      <p className="text-sm text-gray-500">
                        Number of problems per quiz
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {questionOptions.map((count) => (
                      <button
                        key={count}
                        onClick={() => setQuestionsPerQuiz(count)}
                        className={`
                          flex-1 py-2 px-3 rounded-xl font-bold
                          transition-all duration-200
                          ${
                            questionsPerQuiz === count
                              ? 'bg-accent-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Hints Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-accent-500" />
                    <div>
                      <p className="font-semibold text-gray-800">Show Hints</p>
                      <p className="text-sm text-gray-500">
                        Display helpful tips
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleHints}
                    className={`
                      relative w-14 h-8 rounded-full transition-colors duration-200
                      ${showHints ? 'bg-accent-500' : 'bg-gray-300'}
                    `}
                    aria-label={showHints ? 'Hide hints' : 'Show hints'}
                  >
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                      animate={{ left: showHints ? '1.75rem' : '0.25rem' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Reset Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSettings}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
