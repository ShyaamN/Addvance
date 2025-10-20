# Addvance Maths Quiz Mode - Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing from Addvance Maths' existing branding combined with educational platforms like Khan Academy and Duolingo for quiz interactions. The design prioritizes clarity, encouragement, and distraction-free learning experiences.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary Blue: 210 80% 57% (Addvance Maths signature blue)
- Success Green: 142 71% 45% (correct answers)
- Error Red: 0 72% 51% (incorrect answers)
- Warning Orange: 38 92% 50% (timer alerts)
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Text Primary: 222 47% 11% (dark slate)
- Text Secondary: 215 14% 34% (medium slate)

**Dark Mode:**
- Primary Blue: 210 85% 65% (brighter for contrast)
- Success Green: 142 65% 55%
- Error Red: 0 65% 61%
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Text Primary: 0 0% 98%
- Text Secondary: 217 10% 70%

### B. Typography

**Font Stack:**
- Primary: 'Inter', -apple-system, system-ui, sans-serif
- Headings: 'Poppins', 'Inter', sans-serif (for quiz titles and headings)
- Monospace: 'JetBrains Mono', monospace (for mathematical expressions if needed)

**Type Scale:**
- Quiz Title: text-3xl font-bold (lg:text-4xl)
- Question Text: text-xl font-semibold (lg:text-2xl)
- Answer Options: text-base font-medium (lg:text-lg)
- Feedback Text: text-sm font-normal (lg:text-base)
- Timer/Score: text-lg font-bold (lg:text-xl)
- Body Text: text-base font-normal

### C. Layout System

**Spacing Primitives:**
Core units: 2, 4, 6, 8, 12, 16 (Tailwind scale)
- Component padding: p-4, p-6, p-8
- Section spacing: mb-6, mb-8, mb-12
- Card spacing: gap-4, gap-6
- Button padding: px-6 py-3, px-8 py-4

**Container Strategy:**
- Quiz container: max-w-4xl mx-auto px-4
- Question cards: w-full with internal max-w-3xl
- Answer grid: grid-cols-1 md:grid-cols-2 gap-4

### D. Component Library

**Navigation Header:**
- Sticky top bar with Addvance Maths logo (blue)
- Topic breadcrumb (Home > Year 9 > Quadratics > Quiz)
- Progress bar below header showing quiz completion
- Exit/Home button (top-right)

**Quiz Selection Screen:**
- Year level cards (6-11) in grid layout (grid-cols-2 lg:grid-cols-3)
- Each card shows year number, grade level, topic count
- Hover effect: subtle lift (hover:-translate-y-1) and shadow increase
- Topic selection within year level using pill buttons with blue background when selected

**Question Display:**
- Clean white/dark card with rounded corners (rounded-xl)
- Question number badge (top-left, blue background)
- Timer display (top-right, orange when <30s remaining)
- Question text centered with ample whitespace (py-8)
- Mathematical notation properly formatted (use KaTeX/MathJax rendering)

**Answer Options:**
- Four options (A-D) displayed as interactive cards
- Rounded borders (rounded-lg), transition on hover
- Neutral state: border-2 border-gray-300
- Selected state: border-blue-500 bg-blue-50 (dark: bg-blue-900/20)
- Correct (after submit): border-green-500 bg-green-50 with checkmark icon
- Incorrect (after submit): border-red-500 bg-red-50 with X icon
- Disabled state after answer submission

**Feedback Panel:**
- Slides in from bottom after answer submission
- Correct: Green background (bg-green-50 dark:bg-green-900/20)
- Incorrect: Red background with explanation
- "Next Question" button (blue, prominent)
- Explanation text with clear typography

**Score Display:**
- Circular progress indicator showing correct/total
- Color-coded: Green (>80%), Blue (60-80%), Orange (<60%)
- Running score in header: "15/20" with small trophy icon

**Results Screen:**
- Large celebration/encouragement message based on score
- Detailed breakdown: pie chart or bar showing correct/incorrect/skipped
- Topic-wise performance indicators
- "Retry Quiz" and "Choose New Topic" buttons
- Encouraging messages: "Great job!", "Keep practicing!", "You're improving!"

**Timer Component:**
- Countdown display in header
- Color transitions: Blue → Orange (<2min) → Red (<30s)
- Pulse animation when time is running low
- Optional: Sound alert at 1 minute remaining

### E. Interactions & Animations

**Minimal, Purposeful Animations:**
- Answer card selection: scale-[1.02] transform
- Feedback panel: slide-up transition (300ms ease-out)
- Progress bar: smooth width transition
- Question transition: fade-in (200ms)
- Success confetti burst: brief celebration on quiz completion (using canvas-confetti library)
- Timer pulse: animate-pulse when <30s

**Accessibility:**
- High contrast ratios (WCAG AAA)
- Keyboard navigation: Tab through answers, Enter to select, Space for next
- Screen reader labels for all interactive elements
- Focus indicators: ring-2 ring-blue-500 ring-offset-2
- Skip to question button for keyboard users

## Images

**Logo Asset:**
- Use Addvance Maths logo (blue mathematical plus symbol with text) in header
- Size: h-8 to h-12 depending on viewport
- Link back to main Addvance Maths website

**Decorative Elements:**
- Small mathematical icons (∑, π, ∞, √) as subtle background patterns on quiz selection cards
- Success/error icons: Heroicons check-circle and x-circle
- Trophy icon for high scores (use Heroicons trophy)

**No Hero Image:** This is a utility app focused on quiz functionality, not a landing page.

## Key Design Principles

1. **Clarity First:** Questions and answers must be instantly readable with zero ambiguity
2. **Encouraging Feedback:** Positive reinforcement even for incorrect answers with helpful explanations
3. **Distraction-Free:** Minimal decorative elements, focus entirely on learning
4. **Responsive Excellence:** Seamless experience from mobile to desktop
5. **Addvance Branding:** Consistent use of signature blue color throughout all interactive elements