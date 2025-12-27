import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Stars, Sparkles, Trophy, Rocket, Shuffle, Zap, Infinity as InfinityIcon } from 'lucide-react';
import { Card, StarRating } from '../ui';
import type { QuizLevel, QuizMode } from '../../types';
import { LEVEL_CONFIGS } from '../../types';
import { playSound } from '../../utils/sounds';

/**
 * LevelCard Props Interface
 */
interface LevelCardProps {
  /** The quiz level */
  level: QuizLevel;
  /** Quiz mode */
  mode?: QuizMode;
  /** Index for staggered animation */
  index?: number;
}

/**
 * Icon mapping for levels
 */
const iconMap: Record<string, React.ReactNode> = {
  Star: <Star className="w-10 h-10 md:w-12 md:h-12" />,
  Stars: <Stars className="w-10 h-10 md:w-12 md:h-12" />,
  Sparkles: <Sparkles className="w-10 h-10 md:w-12 md:h-12" />,
  Trophy: <Trophy className="w-10 h-10 md:w-12 md:h-12" />,
  Rocket: <Rocket className="w-10 h-10 md:w-12 md:h-12" />,
  Shuffle: <Shuffle className="w-10 h-10 md:w-12 md:h-12" />,
  Zap: <Zap className="w-10 h-10 md:w-12 md:h-12" />,
  Infinity: <InfinityIcon className="w-10 h-10 md:w-12 md:h-12" />,
};

/**
 * Color style mapping
 */
const colorStyles: Record<string, { bg: string; icon: string; border: string }> = {
  primary: {
    bg: 'bg-gradient-to-br from-primary-100 to-primary-200',
    icon: 'text-primary-500',
    border: 'border-primary-300',
  },
  secondary: {
    bg: 'bg-gradient-to-br from-secondary-100 to-secondary-200',
    icon: 'text-secondary-500',
    border: 'border-secondary-300',
  },
  accent: {
    bg: 'bg-gradient-to-br from-accent-100 to-accent-200',
    icon: 'text-accent-500',
    border: 'border-accent-300',
  },
  fun: {
    bg: 'bg-gradient-to-br from-fun-pink/20 to-fun-purple/20',
    icon: 'text-fun-purple',
    border: 'border-fun-pink/30',
  },
};

/**
 * Animation variants
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
  hover: {
    scale: 1.03,
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * LevelCard Component
 * A card for selecting quiz difficulty level
 */
export const LevelCard: React.FC<LevelCardProps> = ({ level, mode = 'standard', index = 0 }) => {
  const navigate = useNavigate();
  const config = LEVEL_CONFIGS[level];
  const colors = colorStyles[config.color];
  const icon = iconMap[config.icon];

  const handleClick = () => {
    playSound('click');
    const modeParam = mode === 'unlimited' ? '?mode=unlimited' : '';
    navigate(`/quiz/${level}${modeParam}`);
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <Card
        variant="interactive"
        padding="lg"
        className={`
          ${colors.bg} ${colors.border}
          border-2
          cursor-pointer
          min-h-[180px] md:min-h-[200px]
        `}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center text-center gap-3">
          {/* Icon */}
          <motion.div
            className={`${colors.icon} mb-2`}
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">
            {config.name}
          </h3>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-600">
            {config.description}
          </p>

          {/* Difficulty stars */}
          <div className="mt-2">
            <StarRating rating={config.difficulty} max={3} size="md" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * LevelGrid Component
 * Grid layout for all level cards
 */
export const LevelGrid: React.FC<{ mode?: QuizMode }> = ({ mode = 'standard' }) => {
  const levels: QuizLevel[] = [
    'add-sub-10', 'add-sub-20', 'add-sub-100', 'add-sub-1000',
    'mixed-10', 'mixed-20', 'mixed-100', 'mixed-1000'
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
      {levels.map((level, index) => (
        <LevelCard key={level} level={level} mode={mode} index={index} />
      ))}
    </div>
  );
};

export default LevelCard;
