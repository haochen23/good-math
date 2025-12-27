# Good Math - Implementation Tasks

## Overview
This document outlines the implementation tasks for the Good Math web application, a child-friendly math learning tool for ages 5-7.

---

## Phase 1: Project Setup & Foundation

### Task 1.1: Initialize Vite React TypeScript Project
**Description**: Set up the base project with Vite, React 18, and TypeScript configuration.

**Acceptance Checklist**:
- [ ] Project created with `npm create vite@latest` using React + TypeScript template
- [ ] TypeScript strict mode enabled in `tsconfig.json`
- [ ] Project runs successfully with `npm run dev`
- [ ] Basic folder structure created (`src/components`, `src/pages`, `src/stores`, `src/utils`, `src/types`, `src/hooks`, `src/constants`)
- [ ] ESLint and Prettier configured with appropriate rules
- [ ] Git repository initialized with `.gitignore`

---

### Task 1.2: Install and Configure Dependencies
**Description**: Install all required npm packages and configure them properly.

**Dependencies**:
- `react-router-dom` - Routing
- `tailwindcss`, `postcss`, `autoprefixer` - Styling
- `framer-motion` - Animations
- `zustand` - State management
- `lucide-react` - Icons

**Acceptance Checklist**:
- [ ] All dependencies installed and listed in `package.json`
- [ ] Tailwind CSS initialized with `tailwind.config.js` and `postcss.config.js`
- [ ] Tailwind directives added to `src/index.css`
- [ ] Custom color palette defined in Tailwind config (child-friendly colors)
- [ ] Framer Motion imported and working
- [ ] Zustand store structure created
- [ ] Lucide React icons importing correctly

---

### Task 1.3: Configure Routing
**Description**: Set up React Router with lazy-loaded pages.

**Routes**:
- `/` - Home page (level selection)
- `/quiz/:level` - Quiz page with level parameter
- `/results` - Results page

**Acceptance Checklist**:
- [ ] `BrowserRouter` configured in `main.tsx`
- [ ] All routes defined in `App.tsx`
- [ ] Pages lazy-loaded with `React.lazy` and `Suspense`
- [ ] Loading fallback component created
- [ ] Navigation between pages works correctly
- [ ] Invalid routes redirect to home page

---

## Phase 2: Type Definitions & Utilities

### Task 2.1: Define TypeScript Types
**Description**: Create comprehensive type definitions for the application.

**Types to Define**:
```typescript
// Quiz levels
type QuizLevel = 'add-sub-10' | 'add-sub-20' | 'mixed-10' | 'mixed-20';

// Math operations
type Operation = 'addition' | 'subtraction';

// Math problem structure
interface MathProblem {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  answer: number;
}

// Quiz state
interface QuizState {
  level: QuizLevel;
  problems: MathProblem[];
  currentIndex: number;
  answers: UserAnswer[];
  isComplete: boolean;
}

// User answer
interface UserAnswer {
  problemId: string;
  userAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
}

// Animation state
type AnimationStep = 'initial' | 'align' | 'carry' | 'calculate' | 'result' | 'complete';
```

**Acceptance Checklist**:
- [ ] All types defined in `src/types/index.ts`
- [ ] Types exported and importable throughout the app
- [ ] No `any` types used
- [ ] Types are well-documented with JSDoc comments
- [ ] Type guards created for runtime validation where needed

---

### Task 2.2: Implement Math Problem Generator
**Description**: Create utility functions to generate random math problems based on difficulty level.

**Requirements**:
- Generate problems within specified number range (10 or 20)
- For subtraction, ensure result is always non-negative
- Support mixed operations mode
- Avoid duplicate problems in a session
- Configurable number of problems per quiz

**Acceptance Checklist**:
- [ ] `generateProblem(level: QuizLevel): MathProblem` function implemented
- [ ] `generateQuiz(level: QuizLevel, count: number): MathProblem[]` function implemented
- [ ] Subtraction always produces non-negative results
- [ ] Problems within correct range for each level
- [ ] Mixed operations randomly choose between add/subtract
- [ ] No consecutive duplicate problems
- [ ] Unit tests pass for all edge cases (0+0, 10-10, max values)

---

### Task 2.3: Create Sound Effect Utilities
**Description**: Implement sound management utilities with mute support.

**Sound Effects Needed**:
- Button click (subtle)
- Correct answer (cheerful chime)
- Incorrect answer (gentle, non-punishing)
- Quiz complete (celebration)
- Number input (soft click)

**Acceptance Checklist**:
- [ ] Sound files sourced/created (royalty-free)
- [ ] `SoundManager` class or hook created
- [ ] `playSound(soundName: string)` function works
- [ ] Global mute toggle implemented
- [ ] Sound preference persisted to localStorage
- [ ] Sounds preloaded to prevent delay
- [ ] Graceful fallback if audio fails to load
- [ ] Volume normalized across all sounds

---

## Phase 3: State Management

### Task 3.1: Create Quiz Store (Zustand)
**Description**: Implement the main quiz state management store.

**Store Actions**:
- `startQuiz(level: QuizLevel)` - Initialize new quiz
- `submitAnswer(answer: number)` - Submit answer for current problem
- `nextProblem()` - Move to next problem
- `resetQuiz()` - Reset quiz state
- `getResults()` - Calculate and return quiz results

**Acceptance Checklist**:
- [ ] Store created in `src/stores/quizStore.ts`
- [ ] All actions implemented and working
- [ ] State properly typed with TypeScript
- [ ] Selectors created for common state queries
- [ ] Store handles edge cases (empty quiz, already complete)
- [ ] Timer functionality for tracking time per problem
- [ ] Results calculation accurate (correct count, percentage, average time)

---

### Task 3.2: Create Settings Store
**Description**: Implement settings state management with persistence.

**Settings**:
- `soundEnabled: boolean` - Toggle sound effects
- `animationSpeed: 'slow' | 'normal' | 'fast'` - Animation speed preference
- `questionsPerQuiz: number` - Number of problems (10-20)
- `showHints: boolean` - Show visual hints for young learners

**Acceptance Checklist**:
- [ ] Store created in `src/stores/settingsStore.ts`
- [ ] Zustand persist middleware configured
- [ ] Settings saved to localStorage
- [ ] Settings loaded on app start
- [ ] Default values defined for all settings
- [ ] Type-safe action creators
- [ ] Settings accessible throughout app

---

## Phase 4: UI Components

### Task 4.1: Create Base UI Components
**Description**: Build reusable, child-friendly UI components.

**Components**:
- `Button` - Large, colorful, touch-friendly button
- `Card` - Container with rounded corners and shadow
- `ProgressBar` - Visual progress indicator
- `Badge` - Small status indicator
- `NumberPad` - On-screen number input for children

**Acceptance Checklist**:
- [ ] All components created in `src/components/ui/`
- [ ] Components use Tailwind CSS for styling
- [ ] Touch targets minimum 44x44px
- [ ] Components are accessible (proper ARIA labels)
- [ ] Color variants available (primary, success, warning, danger)
- [ ] Components responsive across device sizes
- [ ] Hover and active states implemented
- [ ] Components documented with prop types

---

### Task 4.2: Create Number Pad Component
**Description**: Build a child-friendly on-screen number pad for answer input.

**Features**:
- Numbers 0-9 in calculator-style layout
- Clear button (C)
- Backspace button
- Submit/Enter button
- Large, colorful buttons
- Visual feedback on press

**Acceptance Checklist**:
- [ ] Number pad displays correctly on all screen sizes
- [ ] All numbers 0-9 functional
- [ ] Clear button clears entire input
- [ ] Backspace removes last digit
- [ ] Submit button triggers answer submission
- [ ] Maximum input length enforced (2 digits for level 10, 3 for level 20)
- [ ] Keyboard input also works (accessibility)
- [ ] Visual press animation on buttons
- [ ] Sound effect on button press (if enabled)

---

### Task 4.3: Create Level Selection Cards
**Description**: Build attractive level selection cards for the home page.

**Levels**:
1. Addition & Subtraction within 10 (⭐)
2. Addition & Subtraction within 20 (⭐⭐)
3. Mixed Operations within 10 (⭐⭐)
4. Mixed Operations within 20 (⭐⭐⭐)

**Acceptance Checklist**:
- [ ] Four level cards displayed on home page
- [ ] Each card shows level name, description, difficulty stars
- [ ] Cards have unique colors/icons
- [ ] Hover animation on desktop
- [ ] Tap feedback on mobile
- [ ] Cards navigate to quiz with correct level parameter
- [ ] Cards are keyboard accessible
- [ ] Responsive grid layout (2x2 on desktop, 1 column on mobile)

---

### Task 4.4: Create Quiz Problem Display
**Description**: Build the component that displays the current math problem.

**Display Elements**:
- Large, readable numbers
- Operation symbol (+ or -)
- Equals sign
- Answer input area
- Problem counter (e.g., "3 of 10")

**Acceptance Checklist**:
- [ ] Problem displays clearly with large font (minimum 48px for numbers)
- [ ] Operation symbol clearly visible
- [ ] Numbers formatted consistently
- [ ] Current problem index shown
- [ ] Answer input area highlighted
- [ ] Component animates between problems
- [ ] Accessibility: screen reader announces problem
- [ ] Visual distinction between question and answer area

---

## Phase 5: Vertical Calculation Animation

### Task 5.1: Design Vertical Calculation Layout
**Description**: Create the visual layout for column arithmetic display.

**Layout Requirements**:
```
    1 2     (first operand)
  +  8     (operator and second operand)
  ────     (line)
    2 0     (result)
```

**Acceptance Checklist**:
- [ ] Numbers align by place value (ones under ones, tens under tens)
- [ ] Operator symbol positioned correctly
- [ ] Horizontal line separates operands from result
- [ ] Adequate spacing between elements
- [ ] Font is monospace or tabular for alignment
- [ ] Layout works for single and double-digit numbers
- [ ] Colors distinguish different parts (operands, operator, result)
- [ ] Responsive sizing for different screens

---

### Task 5.2: Implement Basic Calculation Animation
**Description**: Create Framer Motion animations for the vertical calculation reveal.

**Animation Sequence**:
1. **Initial**: Problem appears (operands visible)
2. **Draw Line**: Horizontal line draws from left to right
3. **Calculate**: Brief pause to build anticipation
4. **Reveal Result**: Answer digits appear one by one (right to left)
5. **Complete**: Celebration effect for correct, gentle feedback for incorrect

**Acceptance Checklist**:
- [ ] Animation variants defined as constants
- [ ] Animation sequence plays in correct order
- [ ] Timing adjustable via settings store
- [ ] Animation smooth at 60fps
- [ ] `AnimatePresence` used for enter/exit
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Animation can be skipped/fast-forwarded
- [ ] Animation triggers celebration on correct answer

---

### Task 5.3: Implement Carry/Borrow Animation (Advanced)
**Description**: Add animations for regrouping in addition (carry) and subtraction (borrow).

**Carry Animation** (e.g., 7 + 5 = 12):
1. Show small "1" carrying to tens place
2. Animate the carry number moving up and left

**Borrow Animation** (e.g., 12 - 5 = 7):
1. Show borrowing from tens place
2. Cross out and adjust the tens digit
3. Show increased value in ones place

**Acceptance Checklist**:
- [ ] Carry animation shows small number floating to tens column
- [ ] Borrow animation shows crossing out and adjusting
- [ ] Animations clearly explain the mathematical concept
- [ ] Colors used to highlight carry/borrow operations
- [ ] Animation timing allows children to follow along
- [ ] Skip option available for experienced users
- [ ] Animation correctly handles all cases within number range

---

### Task 5.4: Create Celebration Animation
**Description**: Build celebration effects for correct answers.

**Effects**:
- Confetti burst
- Star explosion
- Color flash
- Encouraging text ("Great job!", "Amazing!", etc.)
- Optional sound effect

**Acceptance Checklist**:
- [ ] At least 3 celebration variations
- [ ] Confetti/particles animate smoothly
- [ ] Celebration doesn't block UI for too long (1-2 seconds)
- [ ] Celebration respects reduced motion preference
- [ ] Different celebration for quiz completion vs single problem
- [ ] Celebration includes encouraging message
- [ ] Celebration can be dismissed early
- [ ] No janky performance during animation

---

## Phase 6: Pages

### Task 6.1: Build Home Page (Level Selection)
**Description**: Create the main landing page with level selection.

**Page Elements**:
- App title/logo
- Welcome message
- Four level selection cards
- Settings button (gear icon)
- Optional: Recent progress summary

**Acceptance Checklist**:
- [ ] Page renders at `/` route
- [ ] Title "Good Math" or similar child-friendly name displayed
- [ ] All four level cards present and functional
- [ ] Settings icon opens settings modal/drawer
- [ ] Page is fully responsive
- [ ] Animations on page load (staggered card entrance)
- [ ] Keyboard navigation works
- [ ] Page loads quickly (< 1 second)

---

### Task 6.2: Build Quiz Page
**Description**: Create the main quiz interaction page.

**Page Elements**:
- Back button to home
- Progress bar showing current question
- Problem display component
- Number pad for input
- Submit button
- Vertical calculation animation area

**Quiz Flow**:
1. Problem displayed
2. User inputs answer via number pad
3. User submits answer
4. Vertical calculation animation plays showing solution
5. Feedback shown (correct/incorrect)
6. Next problem loads (or navigate to results if complete)

**Acceptance Checklist**:
- [ ] Page renders at `/quiz/:level` route
- [ ] Correct level loaded from URL parameter
- [ ] Progress bar updates with each question
- [ ] Problem displays correctly
- [ ] Number pad functions properly
- [ ] Answer submission works
- [ ] Animation plays after submission
- [ ] Correct/incorrect feedback shown clearly
- [ ] Auto-advance to next problem after animation
- [ ] Navigation to results when quiz complete
- [ ] Back button confirms before leaving (to avoid accidental exit)
- [ ] Timer tracks time per question (optional display)

---

### Task 6.3: Build Results Page
**Description**: Create the quiz results summary page.

**Page Elements**:
- Congratulations/encouragement message
- Score display (correct out of total)
- Percentage score with visual (pie chart or progress ring)
- Time taken
- List of problems with user answers
- "Try Again" button (same level)
- "Choose Level" button (return to home)
- Share/screenshot option (stretch goal)

**Acceptance Checklist**:
- [ ] Page renders at `/results` route
- [ ] Correct score displayed
- [ ] Percentage calculated and shown
- [ ] Visual representation of score (chart/progress ring)
- [ ] Total time displayed
- [ ] Problem review list shows all questions
- [ ] Correct answers highlighted green
- [ ] Incorrect answers show user's answer and correct answer
- [ ] "Try Again" starts new quiz at same level
- [ ] "Choose Level" returns to home page
- [ ] Celebration animation for high scores (> 80%)
- [ ] Encouraging message even for low scores
- [ ] Page prevents direct access without completed quiz

---

### Task 6.4: Build Settings Modal/Page
**Description**: Create settings interface for app configuration.

**Settings Options**:
- Sound on/off toggle
- Animation speed slider (slow/normal/fast)
- Number of questions selector (10/15/20)
- Show hints toggle
- Reset progress option

**Acceptance Checklist**:
- [ ] Settings accessible from home page
- [ ] Modal or slide-out drawer UI
- [ ] All settings functional and persist
- [ ] Visual toggles/sliders are child-friendly
- [ ] Settings changes apply immediately
- [ ] Close button clearly visible
- [ ] Settings labeled clearly
- [ ] Default/reset option available
- [ ] Accessible with keyboard

---

## Phase 7: Integration & Polish

### Task 7.1: Connect All Components
**Description**: Ensure all components, stores, and pages work together seamlessly.

**Integration Points**:
- Level selection → Quiz store → Quiz page
- Quiz answers → Results calculation → Results page
- Settings store → Sound utilities → All components
- Settings store → Animation components

**Acceptance Checklist**:
- [ ] Complete user flow works end-to-end
- [ ] State persists correctly during quiz
- [ ] Navigation between pages is smooth
- [ ] No console errors during normal use
- [ ] Settings affect all relevant components
- [ ] Sound plays when enabled, silent when disabled
- [ ] Animation speed matches settings
- [ ] Quiz question count matches settings

---

### Task 7.2: Add Loading States
**Description**: Implement loading indicators throughout the app.

**Loading Scenarios**:
- Initial app load
- Route transitions
- Quiz generation
- Animation loading

**Acceptance Checklist**:
- [ ] Loading spinner component created
- [ ] Suspense boundaries show loading state
- [ ] Smooth transition from loading to content
- [ ] No flash of unstyled content
- [ ] Loading state is child-friendly (fun animation)
- [ ] Loading times minimized through optimization

---

### Task 7.3: Add Error Handling
**Description**: Implement error boundaries and error states.

**Error Scenarios**:
- Invalid route
- Quiz generation failure
- Audio loading failure
- State corruption

**Acceptance Checklist**:
- [ ] Error boundary component created
- [ ] Friendly error message for children
- [ ] Recovery options provided ("Go Home" button)
- [ ] Errors logged for debugging
- [ ] No crash on malformed URL
- [ ] Graceful degradation if features fail

---

### Task 7.4: Performance Optimization
**Description**: Optimize app performance for smooth experience.

**Optimization Areas**:
- Component memoization
- Lazy loading
- Asset optimization
- Animation performance

**Acceptance Checklist**:
- [ ] Lighthouse performance score > 90
- [ ] First contentful paint < 1.5s
- [ ] Time to interactive < 3s
- [ ] No jank during animations (60fps)
- [ ] Bundle size minimized (< 500KB gzipped)
- [ ] Images optimized
- [ ] Fonts optimized (subset if needed)
- [ ] React DevTools shows no unnecessary re-renders

---

### Task 7.5: Accessibility Audit
**Description**: Ensure app is accessible for all users.

**Accessibility Requirements**:
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- Focus indicators
- ARIA labels

**Acceptance Checklist**:
- [ ] All interactive elements keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Color contrast ratio meets WCAG AA (4.5:1)
- [ ] Images have alt text
- [ ] ARIA labels on custom components
- [ ] Screen reader can announce problems and feedback
- [ ] No accessibility errors in axe DevTools
- [ ] Reduced motion preference respected

---

## Phase 8: Testing & Deployment

### Task 8.1: Write Unit Tests
**Description**: Create unit tests for critical functionality.

**Test Coverage**:
- Math problem generation
- Quiz store actions
- Utility functions
- Component rendering

**Acceptance Checklist**:
- [ ] Test framework configured (Vitest recommended)
- [ ] Math generator tests cover all levels
- [ ] Quiz store tests cover all actions
- [ ] Edge cases tested (boundaries, invalid input)
- [ ] Test coverage > 80% for utilities
- [ ] Tests run in CI pipeline
- [ ] All tests pass

---

### Task 8.2: Write Integration Tests
**Description**: Create integration tests for user flows.

**Test Scenarios**:
- Complete quiz flow (start → answer → results)
- Level selection works correctly
- Settings persist across sessions
- Animation triggers appropriately

**Acceptance Checklist**:
- [ ] Integration test framework configured (Testing Library)
- [ ] Full quiz flow test passes
- [ ] Settings persistence test passes
- [ ] Navigation tests pass
- [ ] Tests simulate real user interaction
- [ ] No flaky tests

---

### Task 8.3: Manual Testing
**Description**: Perform thorough manual testing across devices.

**Test Devices**:
- Desktop (Chrome, Firefox, Safari, Edge)
- Tablet (iPad, Android tablet)
- Mobile (iPhone, Android phone)

**Acceptance Checklist**:
- [ ] All features work on Chrome desktop
- [ ] All features work on Firefox desktop
- [ ] All features work on Safari desktop
- [ ] All features work on iPad
- [ ] All features work on iPhone
- [ ] All features work on Android phone
- [ ] Touch interactions work correctly
- [ ] Responsive design displays correctly
- [ ] Sound works on all platforms
- [ ] No visual glitches

---

### Task 8.4: Build and Deploy
**Description**: Create production build and deploy to hosting.

**Deployment Options**:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Firebase Hosting

**Acceptance Checklist**:
- [ ] Production build completes without errors
- [ ] Build output optimized
- [ ] Environment variables configured
- [ ] Deployment platform configured
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Build preview works
- [ ] Production deployment successful
- [ ] Post-deployment verification complete

---

## Future Enhancements (Backlog)

### Enhancement Ideas
- [ ] Multiplication and division levels
- [ ] User accounts with progress saving
- [ ] Achievement badges
- [ ] Daily challenges
- [ ] Parent dashboard
- [ ] Multiple language support
- [ ] Offline support (PWA)
- [ ] Leaderboards
- [ ] Custom avatar selection
- [ ] Timed challenge mode

---

## Timeline Estimate

| Phase | Estimated Duration |
|-------|-------------------|
| Phase 1: Setup | 0.5 day |
| Phase 2: Types & Utilities | 0.5 day |
| Phase 3: State Management | 0.5 day |
| Phase 4: UI Components | 1 day |
| Phase 5: Animations | 1.5 days |
| Phase 6: Pages | 1 day |
| Phase 7: Integration | 1 day |
| Phase 8: Testing & Deploy | 1 day |
| **Total** | **7 days** |

---

## Notes
- Prioritize child safety: no external links, no personal data collection
- Keep UI simple: young children should navigate without adult help
- Test with actual children in target age group if possible
- Celebrate effort, not just correct answers
- Make incorrect answers a learning opportunity, not a punishment
