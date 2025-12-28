import type { SoundEffect } from '../types';

/**
 * Sound file paths (using Web Audio API with generated sounds)
 * These are synthesized sounds to avoid needing external audio files
 */

// Audio context singleton
let audioContext: AudioContext | null = null;

/**
 * Gets or creates the audio context
 */
const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
};

/**
 * Plays a simple tone
 */
const playTone = (
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
): void => {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
        console.warn('Audio playback failed:', error);
    }
};

/**
 * Plays a sequence of tones
 */
const playSequence = (
    notes: { freq: number; dur: number; delay: number }[],
    type: OscillatorType = 'sine',
    volume: number = 0.3
): void => {
    notes.forEach(({ freq, dur, delay }) => {
        setTimeout(() => playTone(freq, dur, type, volume), delay * 1000);
    });
};

/**
 * Sound effect implementations using Web Audio API
 */
const soundEffects: Record<SoundEffect, () => void> = {
    click: () => {
        playTone(800, 0.05, 'square', 0.1);
    },

    correct: () => {
        // Happy ascending arpeggio
        playSequence([
            { freq: 523.25, dur: 0.1, delay: 0 },     // C5
            { freq: 659.25, dur: 0.1, delay: 0.1 },   // E5
            { freq: 783.99, dur: 0.15, delay: 0.2 },  // G5
            { freq: 1046.50, dur: 0.3, delay: 0.35 }, // C6
        ], 'sine', 0.25);
    },

    incorrect: () => {
        // Gentle descending tone
        playSequence([
            { freq: 350, dur: 0.15, delay: 0 },
            { freq: 280, dur: 0.2, delay: 0.1 },
        ], 'sine', 0.2);
    },

    complete: () => {
        // Celebration fanfare
        playSequence([
            { freq: 523.25, dur: 0.15, delay: 0 },    // C5
            { freq: 523.25, dur: 0.15, delay: 0.15 }, // C5
            { freq: 523.25, dur: 0.15, delay: 0.3 },  // C5
            { freq: 659.25, dur: 0.15, delay: 0.45 }, // E5
            { freq: 783.99, dur: 0.15, delay: 0.6 },  // G5
            { freq: 1046.50, dur: 0.4, delay: 0.75 }, // C6
        ], 'sine', 0.3);
    },

    levelUp: () => {
        // Triumphant sound
        playSequence([
            { freq: 392.00, dur: 0.1, delay: 0 },     // G4
            { freq: 493.88, dur: 0.1, delay: 0.1 },   // B4
            { freq: 587.33, dur: 0.1, delay: 0.2 },   // D5
            { freq: 783.99, dur: 0.3, delay: 0.3 },   // G5
        ], 'sine', 0.3);
    },

    pop: () => {
        playTone(600, 0.08, 'sine', 0.15);
    },
};

/**
 * Sound manager class for handling all app sounds
 */
class SoundManager {
    private enabled: boolean = true;

    /**
     * Enables sound effects
     */
    enable(): void {
        this.enabled = true;
    }

    /**
     * Disables sound effects
     */
    disable(): void {
        this.enabled = false;
    }

    /**
     * Toggles sound effects
     */
    toggle(): boolean {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Checks if sound is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Sets the enabled state
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Plays a sound effect
     */
    play(effect: SoundEffect): void {
        if (!this.enabled) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (audioContext?.state === 'suspended') {
            audioContext.resume();
        }

        const soundFn = soundEffects[effect];
        if (soundFn) {
            soundFn();
        }
    }

    /**
     * Initializes the audio context (call on user interaction)
     */
    init(): void {
        getAudioContext();
    }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Export type-safe play function
export const playSound = (effect: SoundEffect): void => {
    soundManager.play(effect);
};
