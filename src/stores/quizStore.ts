import { create } from 'zustand';
import type { 
  QuizLevel, 
  QuizState, 
  MathProblem, 
  UserAnswer, 
  QuizResults,
  DetailedResult,
  QuizMode
} from '../types';
import { generateQuiz, generateProblem, validateAnswer } from '../utils/mathGenerator';
import { DEFAULT_QUESTIONS } from '../constants';

/**
 * Quiz Store Interface
 * Defines all state and actions for quiz management
 */
interface QuizStore extends QuizState {
  /** Starts a new quiz with the specified level */
  startQuiz: (level: QuizLevel, questionCount?: number, mode?: QuizMode) => void;
  /** Submits an answer for the current problem */
  submitAnswer: (answer: number) => boolean;
  /** Moves to the next problem */
  nextProblem: () => void;
  /** Resets the quiz state */
  resetQuiz: () => void;
  /** Gets the current problem */
  getCurrentProblem: () => MathProblem | null;
  /** Gets the quiz results */
  getResults: () => QuizResults;
  /** Checks if the quiz is started */
  isStarted: () => boolean;
  /** End unlimited mode session */
  endUnlimitedSession: () => void;
}

/**
 * Initial quiz state
 */
const initialState: QuizState = {
  level: null,
  mode: 'standard',
  problems: [],
  currentIndex: 0,
  answers: [],
  isComplete: false,
  startTime: null,
  problemStartTime: null,
  totalAnswered: 0,
  correctInSession: 0,
};

/**
 * Quiz Store
 * Manages all quiz-related state and logic
 */
export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  /**
   * Starts a new quiz with the specified level
   * @param level - The quiz difficulty level
   * @param questionCount - Number of questions (defaults to settings, ignored in unlimited mode)
   * @param mode - Quiz mode (standard or unlimited)
   */
  startQuiz: (level: QuizLevel, questionCount: number = DEFAULT_QUESTIONS, mode: QuizMode = 'standard') => {
    const now = Date.now();
    
    if (mode === 'unlimited') {
      // Generate initial batch of problems for unlimited mode
      const problems = generateQuiz(level, 5);
      set({
        level,
        mode,
        problems,
        currentIndex: 0,
        answers: [],
        isComplete: false,
        startTime: now,
        problemStartTime: now,
        totalAnswered: 0,
        correctInSession: 0,
      });
    } else {
      const problems = generateQuiz(level, questionCount);
      set({
        level,
        mode,
        problems,
        currentIndex: 0,
        answers: [],
        isComplete: false,
        startTime: now,
        problemStartTime: now,
        totalAnswered: 0,
        correctInSession: 0,
      });
    }
  },

  /**
   * Submits an answer for the current problem
   * @param answer - The user's answer
   * @returns Whether the answer was correct
   */
  submitAnswer: (answer: number): boolean => {
    const { problems, currentIndex, answers, problemStartTime, totalAnswered, correctInSession } = get();
    
    if (currentIndex >= problems.length) {
      return false;
    }
    
    const currentProblem = problems[currentIndex];
    const isCorrect = validateAnswer(currentProblem, answer);
    const timeSpent = problemStartTime ? Date.now() - problemStartTime : 0;
    
    const userAnswer: UserAnswer = {
      problemId: currentProblem.id,
      userAnswer: answer,
      isCorrect,
      timeSpent,
    };
    
    set({
      answers: [...answers, userAnswer],
      totalAnswered: totalAnswered + 1,
      correctInSession: isCorrect ? correctInSession + 1 : correctInSession,
    });
    
    return isCorrect;
  },

  /**
   * Moves to the next problem or completes the quiz
   */
  nextProblem: () => {
    const { currentIndex, problems, mode, level } = get();
    const nextIndex = currentIndex + 1;
    
    if (mode === 'unlimited') {
      // In unlimited mode, generate new problem when running low
      if (nextIndex >= problems.length - 2 && level) {
        const newProblem = generateProblem(level);
        set({
          problems: [...problems, newProblem],
          currentIndex: nextIndex,
          problemStartTime: Date.now(),
        });
      } else {
        set({
          currentIndex: nextIndex,
          problemStartTime: Date.now(),
        });
      }
    } else {
      // Standard mode
      if (nextIndex >= problems.length) {
        set({
          isComplete: true,
          problemStartTime: null,
        });
      } else {
        set({
          currentIndex: nextIndex,
          problemStartTime: Date.now(),
        });
      }
    }
  },

  /**
   * End unlimited mode session and go to results
   */
  endUnlimitedSession: () => {
    set({
      isComplete: true,
      problemStartTime: null,
    });
  },

  /**
   * Resets the quiz to initial state
   */
  resetQuiz: () => {
    set(initialState);
  },

  /**
   * Gets the current problem
   * @returns The current problem or null if quiz is complete
   */
  getCurrentProblem: (): MathProblem | null => {
    const { problems, currentIndex, isComplete } = get();
    
    if (isComplete || currentIndex >= problems.length) {
      return null;
    }
    
    return problems[currentIndex];
  },

  /**
   * Gets the quiz results
   * @returns Quiz results summary
   */
  getResults: (): QuizResults => {
    const { problems, answers, startTime, mode, totalAnswered, correctInSession } = get();
    
    // For unlimited mode, use session stats
    if (mode === 'unlimited') {
      const totalTime = startTime ? Date.now() - startTime : 0;
      const averageTime = totalAnswered > 0 
        ? Math.round(totalTime / totalAnswered) 
        : 0;
      
      const detailedResults: DetailedResult[] = answers.map((answer, index) => ({
        problem: problems[index],
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        timeSpent: answer.timeSpent,
      }));
      
      return {
        totalProblems: totalAnswered,
        correctCount: correctInSession,
        incorrectCount: totalAnswered - correctInSession,
        percentage: totalAnswered > 0 
          ? Math.round((correctInSession / totalAnswered) * 100) 
          : 0,
        totalTime,
        averageTime,
        detailedResults,
      };
    }
    
    // Standard mode
    const correctCount = answers.filter(a => a.isCorrect).length;
    const incorrectCount = answers.filter(a => !a.isCorrect).length;
    const totalProblems = problems.length;
    const percentage = totalProblems > 0 
      ? Math.round((correctCount / totalProblems) * 100) 
      : 0;
    
    const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTime = answers.length > 0 
      ? Math.round(totalTime / answers.length) 
      : 0;
    
    // Create detailed results by matching problems with answers
    const detailedResults: DetailedResult[] = problems.map((problem, index) => {
      const answer = answers[index];
      return {
        problem,
        userAnswer: answer?.userAnswer ?? null,
        isCorrect: answer?.isCorrect ?? false,
        timeSpent: answer?.timeSpent ?? 0,
      };
    });
    
    return {
      totalProblems,
      correctCount,
      incorrectCount,
      percentage,
      totalTime: startTime ? Date.now() - startTime : totalTime,
      averageTime,
      detailedResults,
    };
  },

  /**
   * Checks if a quiz is currently in progress
   */
  isStarted: (): boolean => {
    const { level, problems } = get();
    return level !== null && problems.length > 0;
  },
}));

/**
 * Selector hooks for specific state slices
 */
export const useCurrentProblem = () => useQuizStore(state => state.getCurrentProblem());
export const useQuizLevel = () => useQuizStore(state => state.level);
export const useQuizMode = () => useQuizStore(state => state.mode);
export const useIsQuizComplete = () => useQuizStore(state => state.isComplete);
export const useTotalAnswered = () => useQuizStore(state => state.totalAnswered);
export const useCorrectInSession = () => useQuizStore(state => state.correctInSession);
