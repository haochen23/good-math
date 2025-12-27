/**
 * Application Constants
 */

/** Minimum number of questions per quiz */
export const MIN_QUESTIONS = 5;

/** Maximum number of questions per quiz */
export const MAX_QUESTIONS = 20;

/** Default number of questions per quiz */
export const DEFAULT_QUESTIONS = 10;

/** Minimum touch target size in pixels (accessibility) */
export const MIN_TOUCH_TARGET = 44;

/** Maximum digits allowed for answer input (within 10) */
export const MAX_DIGITS_10 = 2;

/** Maximum digits allowed for answer input (within 20) */
export const MAX_DIGITS_20 = 2;

/** Animation durations in milliseconds */
export const ANIMATION_DURATIONS = {
  /** Fast transition */
  fast: 150,
  /** Normal transition */
  normal: 300,
  /** Slow transition */
  slow: 500,
  /** Page transition */
  page: 400,
  /** Celebration animation */
  celebration: 2000,
} as const;

/** Celebration messages for correct answers */
export const CELEBRATION_MESSAGES = [
  'Amazing! 🌟',
  'Great job! 🎉',
  'You got it! ⭐',
  'Wonderful! 🏆',
  'Fantastic! 🚀',
  'Super! 💫',
  'Brilliant! ✨',
  'Awesome! 🎯',
  'Perfect! 🌈',
  'Well done! 👏',
] as const;

/** Encouragement messages for incorrect answers */
export const ENCOURAGEMENT_MESSAGES = [
  "That's okay, keep trying! 💪",
  "Almost there! Try again! 🌟",
  "Good effort! Let's learn! 📚",
  "Don't give up! You can do it! 🎯",
  "Keep going! Practice makes perfect! ⭐",
] as const;

/** Messages for quiz completion based on score */
export const COMPLETION_MESSAGES = {
  excellent: [
    "Outstanding! You're a math star! 🌟",
    "Amazing work! Keep shining! ✨",
    "Incredible! You're a champion! 🏆",
  ],
  good: [
    "Great job! Keep practicing! 👍",
    "Well done! You're getting better! 📈",
    "Nice work! Almost perfect! 🎯",
  ],
  needsPractice: [
    "Good try! Practice makes perfect! 💪",
    "Keep going! You're learning! 📚",
    "Nice effort! Let's try again! 🌈",
  ],
} as const;

/** Score thresholds for completion messages */
export const SCORE_THRESHOLDS = {
  excellent: 90,
  good: 70,
} as const;

/** Local storage keys */
export const STORAGE_KEYS = {
  settings: 'good-math-settings',
  progress: 'good-math-progress',
} as const;

/** Route paths */
export const ROUTES = {
  home: '/',
  quiz: '/quiz/:level',
  results: '/results',
} as const;

/** Quiz level route parameter values */
export const LEVEL_PARAMS = {
  'add-sub-10': 'add-sub-10',
  'add-sub-20': 'add-sub-20',
  'mixed-10': 'mixed-10',
  'mixed-20': 'mixed-20',
} as const;
