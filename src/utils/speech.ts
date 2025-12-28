/**
 * Speech Synthesis Utility
 * Provides text-to-speech functionality for the math animation
 */

/**
 * Speech Manager Singleton
 * Manages speech synthesis with female voice preference
 */
class SpeechManager {
    private synth: SpeechSynthesis | null = null;
    private voice: SpeechSynthesisVoice | null = null;
    private enabled: boolean = true;

    constructor() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synth = window.speechSynthesis;
            this.initVoice();
        }
    }

    /**
     * Initialize and select a female voice
     */
    private initVoice(): void {
        if (!this.synth) return;

        const loadVoices = () => {
            const voices = this.synth!.getVoices();

            // Prefer female English voices
            // Priority: 1. Samantha (macOS), 2. Any female English voice, 3. Any English voice
            const femaleVoices = voices.filter(v =>
                v.lang.startsWith('en') &&
                (v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('samantha') ||
                    v.name.toLowerCase().includes('karen') ||
                    v.name.toLowerCase().includes('victoria') ||
                    v.name.toLowerCase().includes('zira') ||
                    v.name.toLowerCase().includes('susan'))
            );

            if (femaleVoices.length > 0) {
                this.voice = femaleVoices[0];
            } else {
                // Fallback to any English voice
                const englishVoices = voices.filter(v => v.lang.startsWith('en'));
                this.voice = englishVoices[0] || voices[0] || null;
            }
        };

        // Voices may not be loaded immediately
        if (this.synth.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synth.addEventListener('voiceschanged', loadVoices, { once: true });
        }
    }

    /**
     * Set whether speech is enabled
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
        if (!enabled) {
            this.stop();
        }
    }

    /**
     * Check if speech is enabled
     */
    isEnabled(): boolean {
        return this.enabled && this.synth !== null;
    }

    /**
     * Stop any current speech
     */
    stop(): void {
        if (this.synth) {
            this.synth.cancel();
        }
    }

    /**
     * Speak text and return a promise that resolves when speech ends
     * @param text - The text to speak
     * @param rate - Speech rate (0.5-2, default 1)
     * @returns Promise that resolves when speech ends, with duration in ms
     */
    speak(text: string, rate: number = 1): Promise<number> {
        return new Promise((resolve) => {
            if (!this.synth || !this.enabled) {
                // Return estimated duration if speech not available
                const estimatedDuration = (text.length / 15) * 1000 / rate;
                resolve(estimatedDuration);
                return;
            }

            // Cancel any ongoing speech
            this.synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            if (this.voice) {
                utterance.voice = this.voice;
            }

            utterance.rate = rate;
            utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
            utterance.volume = 1;

            const startTime = Date.now();

            utterance.onend = () => {
                const duration = Date.now() - startTime;
                resolve(duration);
            };

            utterance.onerror = () => {
                const duration = Date.now() - startTime;
                resolve(duration);
            };

            this.synth.speak(utterance);
        });
    }

    /**
     * Get estimated duration for text (for animation sync)
     * @param text - The text to estimate
     * @param rate - Speech rate
     * @returns Estimated duration in ms
     */
    estimateDuration(text: string, rate: number = 1): number {
        // Rough estimate: ~150 words per minute at rate 1
        // Average word is ~5 characters
        const words = text.length / 5;
        const minutes = words / 150;
        return (minutes * 60 * 1000) / rate;
    }
}

// Export singleton instance
export const speechManager = new SpeechManager();

/**
 * Generate speech text for addition animation phases
 */
export const getAdditionSpeechText = (
    phase: string,
    placeName: string,
    op1Digit: number,
    op2Digit: number,
    carryIn: number,
    sum: number,
    resultDigit: number,
    carryOut: number
): string => {
    switch (phase) {
        case 'highlight':
            if (carryIn > 0) {
                return `Look at the ${placeName} place. ${op1Digit} and ${op2Digit}, plus ${carryIn} carried over.`;
            }
            return `Look at the ${placeName} place. ${op1Digit} and ${op2Digit}.`;

        case 'calc':
            if (carryIn > 0) {
                const text = `${op1Digit} plus ${op2Digit} plus ${carryIn} equals ${sum}.`;
                if (carryOut > 0) {
                    return text + ` ${sum} is more than 9, so we carry!`;
                }
                return text;
            }
            const text = `${op1Digit} plus ${op2Digit} equals ${sum}.`;
            if (carryOut > 0) {
                return text + ` ${sum} is more than 9, so we carry!`;
            }
            return text;

        case 'carry':
            return `Write ${resultDigit} in the ${placeName} place, and carry ${carryOut} to the next place.`;

        case 'write':
            if (carryOut === 0) {
                return `Write ${resultDigit} in the ${placeName} place.`;
            }
            return ''; // Already spoken in carry phase

        default:
            return '';
    }
};

/**
 * Generate speech text for subtraction animation phases
 */
export const getSubtractionSpeechText = (
    phase: string,
    placeName: string,
    op1Digit: number,
    op2Digit: number,
    borrowIn: number,
    needsBorrow: boolean,
    borrowedValue: number,
    resultDigit: number
): string => {
    const effectiveOp1 = op1Digit - borrowIn;

    switch (phase) {
        case 'highlight':
            if (borrowIn > 0) {
                return `Look at the ${placeName} place. ${op1Digit} minus ${borrowIn} gives us ${effectiveOp1}, and we subtract ${op2Digit}.`;
            }
            return `Look at the ${placeName} place. ${op1Digit} minus ${op2Digit}.`;

        case 'calc':
            if (needsBorrow) {
                return `${effectiveOp1} is less than ${op2Digit}, so we need to borrow! Borrow 10 to get ${borrowedValue}.`;
            }
            return `${effectiveOp1} minus ${op2Digit} equals ${resultDigit}.`;

        case 'carry':
            return `${borrowedValue} minus ${op2Digit} equals ${resultDigit}.`;

        case 'write':
            return `Write ${resultDigit} in the ${placeName} place.`;

        default:
            return '';
    }
};

/**
 * Generate completion speech
 */
export const getCompletionSpeech = (isCorrect: boolean, answer: number): string => {
    if (isCorrect) {
        const celebrations = [
            'Correct! Great job!',
            'Yes! You got it right!',
            'Excellent work!',
            'Perfect! Well done!',
        ];
        return celebrations[Math.floor(Math.random() * celebrations.length)];
    }
    return `The answer is ${answer}. Keep trying!`;
};

export default speechManager;
