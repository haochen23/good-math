import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

/**
 * Loading fallback component
 */
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-lg text-gray-600 font-medium">Loading...</p>
    </motion.div>
  </div>
);

/**
 * Main App Component
 * Sets up routing and global providers
 */
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:level" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
