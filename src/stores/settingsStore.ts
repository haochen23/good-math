import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, AnimationSpeed } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { STORAGE_KEYS } from '../constants';
import { soundManager } from '../utils/sounds';

/**
 * Settings Store Interface
 * Defines all settings state and actions
 */
interface SettingsStore extends Settings {
  /** Toggles sound effects on/off */
  toggleSound: () => void;
  /** Sets the animation speed */
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  /** Sets the number of questions per quiz */
  setQuestionsPerQuiz: (count: number) => void;
  /** Toggles hints visibility */
  toggleHints: () => void;
  /** Resets all settings to defaults */
  resetSettings: () => void;
  /** Updates a specific setting */
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

/**
 * Settings Store
 * Manages app settings with localStorage persistence
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      /**
       * Toggles sound effects on/off
       */
      toggleSound: () => {
        const newValue = !get().soundEnabled;
        soundManager.setEnabled(newValue);
        set({ soundEnabled: newValue });
      },

      /**
       * Sets the animation speed
       * @param speed - The new animation speed
       */
      setAnimationSpeed: (speed: AnimationSpeed) => {
        set({ animationSpeed: speed });
      },

      /**
       * Sets the number of questions per quiz
       * @param count - Number of questions (5-20)
       */
      setQuestionsPerQuiz: (count: number) => {
        const clampedCount = Math.min(20, Math.max(5, count));
        set({ questionsPerQuiz: clampedCount });
      },

      /**
       * Toggles hints visibility
       */
      toggleHints: () => {
        set({ showHints: !get().showHints });
      },

      /**
       * Resets all settings to defaults
       */
      resetSettings: () => {
        soundManager.setEnabled(DEFAULT_SETTINGS.soundEnabled);
        set(DEFAULT_SETTINGS);
      },

      /**
       * Updates a specific setting
       * @param key - The setting key to update
       * @param value - The new value
       */
      updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => {
        if (key === 'soundEnabled') {
          soundManager.setEnabled(value as boolean);
        }
        set({ [key]: value } as Pick<Settings, K>);
      },
    }),
    {
      name: STORAGE_KEYS.settings,
      // Only persist specific fields
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        animationSpeed: state.animationSpeed,
        questionsPerQuiz: state.questionsPerQuiz,
        showHints: state.showHints,
      }),
      // Sync sound manager on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          soundManager.setEnabled(state.soundEnabled);
        }
      },
    }
  )
);

/**
 * Selector hooks for specific settings
 */
export const useSoundEnabled = () => useSettingsStore(state => state.soundEnabled);
export const useAnimationSpeed = () => useSettingsStore(state => state.animationSpeed);
export const useQuestionsPerQuiz = () => useSettingsStore(state => state.questionsPerQuiz);
export const useShowHints = () => useSettingsStore(state => state.showHints);
