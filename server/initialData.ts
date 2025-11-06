import { Topic } from "../shared/schema";

// Initial quiz data with organizational fields (category, mode, difficulty)
export const initialTopics: Topic[] = [
  // Year 7 - Number Topics
  {
    id: "fractions-7",
    name: "Fractions",
    icon: "➗",
    yearLevel: 7,
    category: "Number",
    mode: "quiz",
    questions: [
      {
        id: "f1",
        question: "Simplify: 2/3 + 1/6",
        options: ["5/6", "3/9", "1/2", "2/3"],
        correctAnswer: 0,
        explanation: "2/3 = 4/6, so 4/6 + 1/6 = 5/6",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "f2",
        question: "What is 3/4 × 2/5?",
        options: ["3/10", "6/20", "5/9", "1/2"],
        correctAnswer: 0,
        explanation: "Multiply numerators and denominators: (3×2)/(4×5) = 6/20 = 3/10",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "f3",
        question: "What is 1/2 ÷ 1/4?",
        options: ["2", "1/8", "1/6", "4"],
        correctAnswer: 0,
        explanation: "Dividing by a fraction means multiplying by its reciprocal: 1/2 × 4/1 = 2",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "f4",
        question: "Convert 0.75 to a fraction in simplest form",
        options: ["3/4", "7/10", "75/100", "15/20"],
        correctAnswer: 0,
        explanation: "0.75 = 75/100 = 3/4 (divide by 25)",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "f5",
        question: "Which is larger: 2/3 or 3/5?",
        options: ["2/3", "3/5", "They are equal", "Cannot compare"],
        correctAnswer: 0,
        explanation: "Convert to same denominator: 2/3 = 10/15 and 3/5 = 9/15, so 2/3 is larger",
        difficulty: 'higher',
        mode: 'quiz'
      }
    ]
  },
  {
    id: "decimals-7",
    name: "Decimals",
    icon: "•",
    yearLevel: 7,
    category: "Number",
    mode: "quiz",
    questions: [
      {
        id: "d1",
        question: "What is 0.5 + 0.25?",
        options: ["0.75", "0.30", "0.55", "0.80"],
        correctAnswer: 0,
        explanation: "0.5 + 0.25 = 0.75",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "d2",
        question: "What is 1.5 × 2?",
        options: ["3", "2.5", "3.5", "4"],
        correctAnswer: 0,
        explanation: "1.5 × 2 = 3.0",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "d3",
        question: "Round 3.456 to 2 decimal places",
        options: ["3.46", "3.45", "3.50", "3.40"],
        correctAnswer: 0,
        explanation: "The third decimal is 6, which is ≥5, so we round up: 3.46",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "d4",
        question: "What is 0.8 ÷ 0.2?",
        options: ["4", "0.4", "16", "1.6"],
        correctAnswer: 0,
        explanation: "0.8 ÷ 0.2 = 4 (or 8 ÷ 2 = 4)",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "d5",
        question: "Convert 3/8 to a decimal",
        options: ["0.375", "0.38", "0.3", "0.35"],
        correctAnswer: 0,
        explanation: "3 ÷ 8 = 0.375",
        difficulty: 'higher',
        mode: 'quiz'
      }
    ]
  },
  // Year 8 - Algebra Topics
  {
    id: "algebra-basics-8",
    name: "Algebra Basics",
    icon: "x",
    yearLevel: 8,
    category: "Algebra",
    mode: "quiz",
    questions: [
      {
        id: "ab1",
        question: "Simplify: 3x + 2x",
        options: ["5x", "5x²", "6x", "x⁵"],
        correctAnswer: 0,
        explanation: "Add like terms: 3x + 2x = 5x",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "ab2",
        question: "What is 4x - x?",
        options: ["3x", "3", "4", "5x"],
        correctAnswer: 0,
        explanation: "4x - 1x = 3x",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "ab3",
        question: "Expand: 3(x + 2)",
        options: ["3x + 6", "3x + 2", "x + 6", "3x + 5"],
        correctAnswer: 0,
        explanation: "Multiply each term inside by 3: 3×x + 3×2 = 3x + 6",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "ab4",
        question: "Solve: x + 5 = 12",
        options: ["7", "17", "5", "12"],
        correctAnswer: 0,
        explanation: "x = 12 - 5 = 7",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "ab5",
        question: "Solve: 2x = 14",
        options: ["7", "28", "12", "16"],
        correctAnswer: 0,
        explanation: "x = 14 ÷ 2 = 7",
        difficulty: 'foundation',
        mode: 'quiz'
      }
    ]
  },
  // Year 9 - Geometry Topics
  {
    id: "angles-9",
    name: "Angles",
    icon: "∠",
    yearLevel: 9,
    category: "Geometry",
    mode: "quiz",
    questions: [
      {
        id: "a1",
        question: "What is the sum of angles in a triangle?",
        options: ["180°", "360°", "90°", "270°"],
        correctAnswer: 0,
        explanation: "The angles in any triangle always add up to 180°",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "a2",
        question: "If two angles in a triangle are 60° and 70°, what is the third angle?",
        options: ["50°", "60°", "40°", "130°"],
        correctAnswer: 0,
        explanation: "180° - 60° - 70° = 50°",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "a3",
        question: "What type of angle is 95°?",
        options: ["Obtuse", "Acute", "Right", "Reflex"],
        correctAnswer: 0,
        explanation: "An obtuse angle is between 90° and 180°",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "a4",
        question: "Angles on a straight line add up to:",
        options: ["180°", "360°", "90°", "270°"],
        correctAnswer: 0,
        explanation: "Angles on a straight line always sum to 180°",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "a5",
        question: "Vertically opposite angles are:",
        options: ["Equal", "Supplementary", "Complementary", "Right angles"],
        correctAnswer: 0,
        explanation: "When two lines intersect, vertically opposite angles are equal",
        difficulty: 'higher',
        mode: 'quiz'
      }
    ]
  },
  // Year 10 - Ratio & Proportion
  {
    id: "ratio-10",
    name: "Ratio and Proportion",
    icon: ":",
    yearLevel: 10,
    category: "Ratio & Proportion",
    mode: "quiz",
    questions: [
      {
        id: "r1",
        question: "Simplify the ratio 6:9",
        options: ["2:3", "3:2", "6:9", "1:2"],
        correctAnswer: 0,
        explanation: "Divide both sides by 3: 6÷3 : 9÷3 = 2:3",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "r2",
        question: "If 2:3 = x:15, what is x?",
        options: ["10", "5", "6", "12"],
        correctAnswer: 0,
        explanation: "3 × 5 = 15, so 2 × 5 = 10",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "r3",
        question: "Share £20 in the ratio 1:4",
        options: ["£4 and £16", "£5 and £15", "£10 and £10", "£8 and £12"],
        correctAnswer: 0,
        explanation: "Total parts = 5. Each part = £20÷5 = £4. So 1×£4 and 4×£4 = £4 and £16",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "r4",
        question: "A recipe for 4 people needs 200g flour. How much for 6 people?",
        options: ["300g", "250g", "350g", "400g"],
        correctAnswer: 0,
        explanation: "200÷4 = 50g per person. 50×6 = 300g",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "r5",
        question: "What is the ratio 3:6:9 in simplest form?",
        options: ["1:2:3", "3:6:9", "2:4:6", "1:3:5"],
        correctAnswer: 0,
        explanation: "Divide all parts by 3: 1:2:3",
        difficulty: 'higher',
        mode: 'quiz'
      }
    ]
  },
  // Year 11 - Statistics
  {
    id: "statistics-11",
    name: "Statistics",
    icon: "📊",
    yearLevel: 11,
    category: "Statistics",
    mode: "quiz",
    questions: [
      {
        id: "s1",
        question: "Find the mean of: 3, 7, 5, 9, 6",
        options: ["6", "5", "7", "8"],
        correctAnswer: 0,
        explanation: "(3+7+5+9+6) ÷ 5 = 30 ÷ 5 = 6",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "s2",
        question: "Find the median of: 2, 5, 3, 8, 1",
        options: ["3", "2", "5", "8"],
        correctAnswer: 0,
        explanation: "Order the data: 1, 2, 3, 5, 8. The middle value is 3",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "s3",
        question: "What is the mode of: 3, 5, 3, 7, 3, 9?",
        options: ["3", "5", "7", "9"],
        correctAnswer: 0,
        explanation: "The mode is the most frequently occurring value: 3 appears 3 times",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "s4",
        question: "Find the range of: 12, 8, 15, 3, 10",
        options: ["12", "15", "8", "10"],
        correctAnswer: 0,
        explanation: "Range = highest - lowest = 15 - 3 = 12",
        difficulty: 'foundation',
        mode: 'quiz'
      },
      {
        id: "s5",
        question: "The mean of 4 numbers is 10. Three numbers are 8, 12, and 9. What is the fourth?",
        options: ["11", "10", "13", "9"],
        correctAnswer: 0,
        explanation: "Total = 4×10 = 40. Fourth number = 40 - 8 - 12 - 9 = 11",
        difficulty: 'higher',
        mode: 'quiz'
      }
    ]
  }
];
