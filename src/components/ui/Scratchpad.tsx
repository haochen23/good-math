import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, PenTool, ChevronUp, ChevronDown } from 'lucide-react';

/**
 * Scratchpad Props Interface
 */
interface ScratchpadProps {
    /** Additional CSS classes */
    className?: string;
}

/**
 * Scratchpad Component
 * A drawing canvas for draft calculations
 */
export const Scratchpad: React.FC<ScratchpadProps> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [penColor, setPenColor] = useState('#374151'); // gray-700
    const [penSize, setPenSize] = useState(3);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // Resizable height - default to 350px (larger), min 200px, max 80% of viewport
    const [height, setHeight] = useState(350);
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartRef = useRef<{ y: number; height: number } | null>(null);

    // Colors for the pen
    const colors = [
        { value: '#374151', name: 'Gray' },
        { value: '#3b82f6', name: 'Blue' },
        { value: '#ef4444', name: 'Red' },
        { value: '#22c55e', name: 'Green' },
    ];

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, [isExpanded, height]);

    // Handle resize drag
    const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsResizing(true);

        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        resizeStartRef.current = { y: clientY, height };
    }, [height]);

    useEffect(() => {
        if (!isResizing) return;

        const handleResizeMove = (e: MouseEvent | TouchEvent) => {
            if (!resizeStartRef.current) return;

            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const delta = resizeStartRef.current.y - clientY;
            const newHeight = Math.min(
                Math.max(resizeStartRef.current.height + delta, 200), // min 200px
                window.innerHeight * 0.8 // max 80% of viewport
            );
            setHeight(newHeight);
        };

        const handleResizeEnd = () => {
            setIsResizing(false);
            resizeStartRef.current = null;
        };

        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
        document.addEventListener('touchmove', handleResizeMove);
        document.addEventListener('touchend', handleResizeEnd);

        return () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', handleResizeEnd);
            document.removeEventListener('touchmove', handleResizeMove);
            document.removeEventListener('touchend', handleResizeEnd);
        };
    }, [isResizing]);

    // Get coordinates from event
    const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            const touch = e.touches[0];
            if (!touch) return null;
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        }

        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    // Start drawing
    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const coords = getCoordinates(e);
        if (!coords) return;

        setIsDrawing(true);
        lastPointRef.current = coords;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        // Draw a dot for single clicks
        ctx.beginPath();
        ctx.fillStyle = penColor;
        ctx.arc(coords.x, coords.y, penSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }, [getCoordinates, penColor, penSize]);

    // Draw
    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;

        const coords = getCoordinates(e);
        if (!coords || !lastPointRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        lastPointRef.current = coords;
    }, [isDrawing, getCoordinates, penColor, penSize]);

    // Stop drawing
    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
        lastPointRef.current = null;
    }, []);

    // Clear canvas
    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, []);

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-40 ${className}`}>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-t-xl px-4 py-2 flex items-center gap-2 border border-b-0 border-gray-200"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <PenTool className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700">Scratchpad</span>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                )}
            </motion.button>

            {/* Scratchpad Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        ref={containerRef}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white border-t border-gray-200 shadow-lg overflow-hidden flex flex-col"
                    >
                        {/* Resize Handle */}
                        <div
                            onMouseDown={handleResizeStart}
                            onTouchStart={handleResizeStart}
                            className="h-3 bg-gray-100 hover:bg-gray-200 cursor-ns-resize flex items-center justify-center border-b border-gray-200 transition-colors flex-shrink-0"
                        >
                            <div className="w-12 h-1 bg-gray-400 rounded-full" />
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                            {/* Color Picker */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 mr-1">Color:</span>
                                {colors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setPenColor(color.value)}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform ${penColor === color.value ? 'border-primary-500 scale-110' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        aria-label={`Select ${color.name} color`}
                                    />
                                ))}
                            </div>

                            {/* Pen Size */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Size:</span>
                                {[2, 4, 6].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setPenSize(size)}
                                        className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${penSize === size ? 'bg-primary-100' : 'hover:bg-gray-200'
                                            }`}
                                        aria-label={`Pen size ${size}`}
                                    >
                                        <div
                                            className="rounded-full bg-gray-700"
                                            style={{ width: size + 2, height: size + 2 }}
                                        />
                                    </button>
                                ))}
                            </div>

                            {/* Clear Button */}
                            <button
                                onClick={clearCanvas}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Clear</span>
                            </button>
                        </div>

                        {/* Canvas - fills remaining space */}
                        <canvas
                            ref={canvasRef}
                            className="w-full flex-1 cursor-crosshair touch-none"
                            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #f3f4f6 19px, #f3f4f6 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #f3f4f6 19px, #f3f4f6 20px)' }}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Scratchpad;
