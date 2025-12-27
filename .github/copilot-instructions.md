# Copilot Instructions for Good Math

## Project Overview
Good Math is a modern, interactive math learning web application designed for children aged 5-7 (Year 0-2). The app helps young learners practice addition and subtraction through engaging quizzes with animated vertical calculations (竖式计算/column arithmetic).

## Tech Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Routing**: React Router DOM v6

## Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements (Button, Card, ProgressBar)
│   ├── quiz/            # Quiz-related components
│   └── animations/      # Animation components (VerticalCalculation)
├── pages/               # Page components
│   ├── HomePage.tsx     # Level selection page
│   ├── QuizPage.tsx     # Quiz interface
│   └── ResultsPage.tsx  # Quiz results summary
├── stores/              # Zustand state stores
│   ├── quizStore.ts     # Quiz state management
│   └── settingsStore.ts # App settings (sound, theme)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
│   ├── mathGenerator.ts # Problem generation logic
│   └── sounds.ts        # Sound effect utilities
├── types/               # TypeScript type definitions
├── constants/           # App constants and configurations
└── styles/              # Global styles
```

## Coding Standards

### TypeScript
- Use strict TypeScript with no `any` types
- Define interfaces for all props and state
- Use type guards for runtime type checking
- Prefer `type` for simple types, `interface` for objects that may be extended

### React Components
- Use functional components with hooks exclusively
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Use meaningful component and prop names
- Implement proper error boundaries for quiz components

### Naming Conventions
- **Components**: PascalCase (e.g., `QuizCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useQuizState.ts`)
- **Utilities**: camelCase (e.g., `generateProblem.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_QUESTIONS`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `MathProblem`, `QuizLevel`)

### Styling with Tailwind CSS
- Use Tailwind utility classes directly in JSX
- Create custom color palette in `tailwind.config.js` for child-friendly theme
- Use responsive prefixes for mobile-first design
- Extract repeated class combinations into components, not `@apply`

### Animations with Framer Motion
- Define animation variants as constants outside components
- Use `AnimatePresence` for exit animations
- Keep animations performant (prefer `transform` and `opacity`)
- Respect `prefers-reduced-motion` accessibility setting

### State Management with Zustand
- Keep stores focused and minimal
- Use selectors to prevent unnecessary re-renders
- Implement persistence for settings store
- Document store actions with JSDoc comments

## Key Features Implementation

### Math Problem Generation
- Generate problems based on selected level
- Ensure answers are always non-negative for subtraction
- Randomize operand order for variety
- Track problem history to avoid immediate repeats

### Vertical Calculation Animation
- Display numbers right-aligned (by place value)
- Animate carry/borrow operations step-by-step
- Use distinct colors for different parts (operands, operator, line, result)
- Include timing controls for animation speed

### Quiz Flow
1. User selects difficulty level on home page
2. Quiz presents 10-20 problems (configurable)
3. User inputs answer via on-screen number pad
4. Immediate feedback with animation showing correct solution
5. Results page shows summary with option to retry

### Accessibility
- Large touch targets (minimum 44x44px)
- High contrast colors
- Clear, readable fonts (minimum 18px for body text)
- Keyboard navigation support
- Screen reader friendly labels

## Testing Guidelines
- Write unit tests for math generation utilities
- Test animation timing and sequences
- Verify correct/incorrect answer logic
- Test edge cases (0 + 0, 10 - 10, etc.)

## Performance Considerations
- Lazy load pages with React.lazy
- Memoize expensive calculations
- Optimize re-renders with React.memo and useMemo
- Preload sounds and assets

## Child-Friendly UI Guidelines
- Use bright, warm colors (avoid harsh primaries)
- Implement celebration effects for correct answers
- Provide gentle encouragement for incorrect answers
- Use playful icons and optional mascot character
- Keep interface uncluttered and intuitive

## Sound Effects
- Optional and mutable
- Include: button clicks, correct answer chime, incorrect answer sound, level complete celebration
- Store sound preference in localStorage

## Common Commands
```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```
