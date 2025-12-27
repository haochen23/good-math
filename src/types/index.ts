/**
 * Quiz Level Types
 * Defines the different difficulty levels available in the app
 */
export type QuizLevel = 
  | 'add-sub-10'   // Addition & Subtraction within 10
  | 'add-sub-20'   // Addition & Subtraction within 20
  | 'add-sub-100'  // Addition & Subtraction within 100
  | 'add-sub-1000' // Addition & Subtraction within 1000
  | 'mixed-10'     // Mixed operations within 10
  | 'mixed-20'     // Mixed operations within 20
  | 'mixed-100'    // Mixed operations within 100
  | 'mixed-1000';  // Mixed operations within 1000

/**
 * Quiz Mode Types
 */
export type QuizMode = 'standard' | 'unlimited';

/**
 * Math Operation Types
 */
export type Operation = 'addition' | 'subtraction';

/**
 * Math Problem Interface
 * Represents a single math problem in the quiz
 */
export interface MathProblem {
  /** Unique identifier for the problem */
  id: string;
  /** First operand (the larger number in subtraction) */
  operand1: number;
  /** Second operand */
  operand2: number;
  /** The mathematical operation */
  operation: Operation;
  /** The correct answer */
  answer: number;
  /** Whether this problem requires carrying (addition) or borrowing (subtraction) */
  requiresCarry: boolean;
}

/**
 * User Answer Interface
 * Tracks the user's response to a problem
 */
export interface UserAnswer {
  /** Reference to the problem ID */
  problemId: string;
  /** The answer provided by the user (null if skipped) */
  userAnswer: number | null;
  /** Whether the answer was correct */
  isCorrect: boolean;
  /** Time spent on this problem in milliseconds */
  timeSpent: number;
}

/**
 * Quiz State Interface
 * Represents the current state of an active quiz
 */
export interface QuizState {
  /** Current quiz level */
  level: QuizLevel | null;
  /** Quiz mode (standard or unlimited) */
  mode: QuizMode;
  /** Array of problems in the quiz */
  problems: MathProblem[];
  /** Index of the current problem (0-based) */
  currentIndex: number;
  /** Array of user answers */
  answers: UserAnswer[];
  /** Whether the quiz is complete */
  isComplete: boolean;
  /** When the quiz started */
  startTime: number | null;
  /** When the current problem was shown */
  problemStartTime: number | null;
  /** Total problems answered in unlimited mode */
  totalAnswered: number;
  /** Correct answers in unlimited mode */
  correctInSession: number;
}

/**
 * Quiz Results Interface
 * Summary of quiz performance
 */
export interface QuizResults {
  /** Total number of problems */
  totalProblems: number;
  /** Number of correct answers */
  correctCount: number;
  /** Number of incorrect answers */
  incorrectCount: number;
  /** Percentage score (0-100) */
  percentage: number;
  /** Total time taken in milliseconds */
  totalTime: number;
  /** Average time per problem in milliseconds */
  averageTime: number;
  /** Detailed answers with problems */
  detailedResults: DetailedResult[];
}

/**
 * Detailed Result Interface
 * Combines problem and answer information
 */
export interface DetailedResult {
  problem: MathProblem;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
}

/**
 * Animation Step Types
 * Defines the steps in the vertical calculation animation
 */
export type AnimationStep = 
  | 'initial'     // Numbers appear
  | 'operator'    // Operator appears
  | 'line'        // Calculation line draws
  | 'carry'       // Carry/borrow animation (if applicable)
  | 'calculate'   // Calculation happening
  | 'result'      // Result appears digit by digit
  | 'complete';   // Animation finished

/**
 * Animation Speed Types
 */
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

/**
 * Animation Speed Configuration
 */
export const ANIMATION_SPEEDS: Record<AnimationSpeed, number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.5,
};

/**
 * Settings Interface
 * App configuration options
 */
export interface Settings {
  /** Whether sound effects are enabled */
  soundEnabled: boolean;
  /** Animation speed preference */
  animationSpeed: AnimationSpeed;
  /** Number of questions per quiz */
  questionsPerQuiz: number;
  /** Whether to show hints for young learners */
  showHints: boolean;
}

/**
 * Level Configuration Interface
 * Defines properties for each quiz level
 */
export interface LevelConfig {
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Difficulty rating (1-3 stars) */
  difficulty: 1 | 2 | 3;
  /** Maximum number in problems */
  maxNumber: number;
  /** Available operations */
  operations: Operation[];
  /** Theme color */
  color: 'primary' | 'secondary' | 'accent' | 'fun';
  /** Icon name from Lucide */
  icon: string;
}

/**
 * Level Configurations
 */
export const LEVEL_CONFIGS: Record<QuizLevel, LevelConfig> = {
  'add-sub-10': {
    name: 'Numbers to 10',
    description: 'Addition & Subtraction within 10',
    difficulty: 1,
    maxNumber: 10,
    operations: ['addition', 'subtraction'],
    color: 'secondary',
    icon: 'Star',
  },
  'add-sub-20': {
    name: 'Numbers to 20',
    description: 'Addition & Subtraction within 20',
    difficulty: 2,
    maxNumber: 20,
    operations: ['addition', 'subtraction'],
    color: 'accent',
    icon: 'Stars',
  },
  'add-sub-100': {
    name: 'Numbers to 100',
    description: 'Addition & Subtraction within 100',
    difficulty: 2,
    maxNumber: 100,
    operations: ['addition', 'subtraction'],
    color: 'primary',
    icon: 'Sparkles',
  },
  'add-sub-1000': {
    name: 'Numbers to 1000',
    description: 'Addition & Subtraction within 1000',
    difficulty: 3,
    maxNumber: 1000,
    operations: ['addition', 'subtraction'],
    color: 'fun',
    icon: 'Rocket',
  },
  'mixed-10': {
    name: 'Mix it Up! (10)',
    description: 'Mixed operations within 10',
    difficulty: 2,
    maxNumber: 10,
    operations: ['addition', 'subtraction'],
    color: 'primary',
    icon: 'Shuffle',
  },
  'mixed-20': {
    name: 'Mix it Up! (20)',
    description: 'Mixed operations within 20',
    difficulty: 2,
    maxNumber: 20,
    operations: ['addition', 'subtraction'],
    color: 'accent',
    icon: 'Shuffle',
  },
  'mixed-100': {
    name: 'Mix it Up! (100)',
    description: 'Mixed operations within 100',
    difficulty: 3,
    maxNumber: 100,
    operations: ['addition', 'subtraction'],
    color: 'fun',
    icon: 'Zap',
  },
  'mixed-1000': {
    name: 'Challenge Mode',
    description: 'Mixed operations within 1000',
    difficulty: 3,
    maxNumber: 1000,
    operations: ['addition', 'subtraction'],
    color: 'fun',
    icon: 'Trophy',
  },
};

/**
 * Sound Effect Types
 */
export type SoundEffect = 
  | 'click'
  | 'correct'
  | 'incorrect'
  | 'complete'
  | 'levelUp'
  | 'pop';

/**
 * Default Settings
 */
export const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  animationSpeed: 'normal',
  questionsPerQuiz: 10,
  showHints: true,
};
