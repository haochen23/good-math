import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CELEBRATION_MESSAGES, ENCOURAGEMENT_MESSAGES } from '../../constants';

/**
 * Celebration Props Interface
 */
interface CelebrationProps {
    /** Whether to show the celebration */
    show: boolean;
    /** Whether the answer was correct */
    isCorrect: boolean;
    /** Callback when celebration finishes */
    onComplete?: () => void;
    /** Duration in milliseconds */
    duration?: number;
}

/**
 * Confetti piece configuration
 */
interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    rotation: number;
    size: number;
}

/**
 * Confetti colors - bright and cheerful
 */
const confettiColors = [
    '#f9ae19', // primary
    '#4caf50', // secondary
    '#2196f3', // accent
    '#ff6b9d', // pink
    '#9c27b0', // purple
    '#ff9800', // orange
    '#00bcd4', // teal
    '#cddc39', // lime
];

/**
 * Generate random confetti pieces
 */
const generateConfetti = (count: number): ConfettiPiece[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.3,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 6,
    }));
};

/**
 * Get random message
 */
const getRandomMessage = (messages: readonly string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Celebration Component
 * Displays celebration effects for correct answers
 */
export const Celebration: React.FC<CelebrationProps> = ({
    show,
    isCorrect,
    onComplete,
    duration = 2000,
}) => {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (show) {
            if (isCorrect) {
                setConfetti(generateConfetti(30));
                setMessage(getRandomMessage(CELEBRATION_MESSAGES));
            } else {
                setConfetti([]);
                setMessage(getRandomMessage(ENCOURAGEMENT_MESSAGES));
            }

            const timeout = setTimeout(() => {
                onComplete?.();
            }, duration);

            return () => clearTimeout(timeout);
        }
    }, [show, isCorrect, duration, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Confetti for correct answers */}
                    {isCorrect && confetti.map((piece) => (
                        <motion.div
                            key={piece.id}
                            className="absolute top-0"
                            style={{
                                left: `${piece.x}%`,
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            }}
                            initial={{
                                y: -20,
                                rotate: 0,
                                opacity: 1,
                            }}
                            animate={{
                                y: window.innerHeight + 20,
                                rotate: piece.rotation + 720,
                                opacity: [1, 1, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: piece.delay,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        />
                    ))}

                    {/* Starburst effect for correct answers */}
                    {isCorrect && (
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 1.5, 0],
                                opacity: [0, 0.5, 0],
                            }}
                            transition={{ duration: 0.8 }}
                        >
                            <svg
                                width="200"
                                height="200"
                                viewBox="0 0 200 200"
                                className="text-yellow-400"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <motion.line
                                        key={i}
                                        x1="100"
                                        y1="100"
                                        x2="100"
                                        y2="20"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        transform={`rotate(${i * 30} 100 100)`}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.6, delay: i * 0.02 }}
                                    />
                                ))}
                            </svg>
                        </motion.div>
                    )}

                    {/* Message display */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto"
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -20 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <motion.p
                            className={`text-3xl md:text-5xl font-bold drop-shadow-lg ${isCorrect
                                    ? 'text-gradient-rainbow bg-gradient-to-r from-fun-pink via-fun-purple to-accent-500 bg-clip-text text-transparent'
                                    : 'text-gray-700'
                                }`}
                            animate={isCorrect ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.4, repeat: 2 }}
                        >
                            {message}
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * Star explosion animation for high scores
 */
export const StarExplosion: React.FC<{ show: boolean }> = ({ show }) => {
    const stars = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i / 8) * 360,
        delay: i * 0.05,
    }));

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {stars.map((star) => (
                        <motion.div
                            key={star.id}
                            className="absolute text-yellow-400"
                            initial={{
                                scale: 0,
                                x: 0,
                                y: 0,
                                rotate: 0,
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                x: Math.cos((star.angle * Math.PI) / 180) * 100,
                                y: Math.sin((star.angle * Math.PI) / 180) * 100,
                                rotate: 360,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: star.delay,
                                ease: 'easeOut',
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Celebration;
