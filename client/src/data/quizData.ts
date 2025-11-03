import { Topic } from "@shared/schema";

// GCSE Maths Quiz Data - Organized by Year Level
export const mockTopics: Topic[] = [
  // Year 7
  {
    id: "fractions-7",
    name: "Fractions",
    icon: "➗",
    yearLevel: 7,
    questions: [
      {
        id: "f1",
        question: "Simplify: 2/3 + 1/6",
        options: ["5/6", "3/9", "1/2", "2/3"],
        correctAnswer: 0,
        explanation: "2/3 = 4/6, so 4/6 + 1/6 = 5/6",
        difficulty: 'foundation'
      },
      {
        id: "f2",
        question: "What is 3/4 × 2/5?",
        options: ["3/10", "6/20", "5/9", "1/2"],
        correctAnswer: 0,
        explanation: "Multiply numerators and denominators: (3×2)/(4×5) = 6/20 = 3/10",
        difficulty: 'foundation'
      },
      {
        id: "f3",
        question: "What is 1/2 ÷ 1/4?",
        options: ["2", "1/8", "1/6", "4"],
        correctAnswer: 0,
        explanation: "Dividing by a fraction means multiplying by its reciprocal: 1/2 × 4/1 = 2",
        difficulty: 'foundation'
      },
      {
        id: "f4",
        question: "Convert 0.75 to a fraction in simplest form",
        options: ["3/4", "7/10", "75/100", "15/20"],
        correctAnswer: 0,
        explanation: "0.75 = 75/100 = 3/4 (divide by 25)",
        difficulty: 'foundation'
      },
      {
        id: "f5",
        question: "Which is larger: 2/3 or 3/5?",
        options: ["2/3", "3/5", "They are equal", "Cannot compare"],
        correctAnswer: 0,
        explanation: "Convert to same denominator: 2/3 = 10/15 and 3/5 = 9/15, so 2/3 is larger",
        difficulty: 'higher'
      }
    ]
  },
  {
    id: "decimals-7",
    name: "Decimals",
    icon: "•",
    yearLevel: 7,
    questions: [
      {
        id: "d1",
        question: "What is 2.5 + 3.75?",
        options: ["6.25", "6.5", "5.25", "6.75"],
        correctAnswer: 0,
        explanation: "Line up decimal points: 2.50 + 3.75 = 6.25",
        difficulty: 'foundation'
      },
      {
        id: "d2",
        question: "What is 0.6 × 0.4?",
        options: ["0.24", "2.4", "0.024", "24"],
        correctAnswer: 0,
        explanation: "6 × 4 = 24, with 2 decimal places: 0.24",
        difficulty: 'foundation'
      },
      {
        id: "d3",
        question: "Round 4.567 to 2 decimal places",
        options: ["4.57", "4.56", "4.6", "5"],
        correctAnswer: 0,
        explanation: "Look at the third decimal place (7), round up: 4.57",
        difficulty: 'foundation'
      },
      {
        id: "d4",
        question: "What is 8.4 ÷ 0.2?",
        options: ["42", "4.2", "420", "0.42"],
        correctAnswer: 0,
        explanation: "Multiply both by 10: 84 ÷ 2 = 42",
        difficulty: 'higher'
      },
      {
        id: "d5",
        question: "Express 0.125 as a fraction",
        options: ["1/8", "1/4", "1/16", "3/8"],
        correctAnswer: 0,
        explanation: "0.125 = 125/1000 = 1/8",
        difficulty: 'higher'
      }
    ]
  },

  // Year 8
  {
    id: "percentages-8",
    name: "Percentages",
    icon: "%",
    yearLevel: 8,
    questions: [
      {
        id: "p1",
        question: "What is 25% of 80?",
        options: ["20", "25", "30", "15"],
        correctAnswer: 0,
        explanation: "25% = 1/4, so 1/4 × 80 = 20",
        difficulty: 'foundation'
      },
      {
        id: "p2",
        question: "A price increased from £50 to £60. What is the percentage increase?",
        options: ["20%", "10%", "25%", "15%"],
        correctAnswer: 0,
        explanation: "Increase = £10. Percentage = (10/50) × 100 = 20%",
        difficulty: 'foundation'
      },
      {
        id: "p3",
        question: "If 30% of a number is 15, what is the number?",
        options: ["50", "45", "60", "40"],
        correctAnswer: 0,
        explanation: "Let x be the number: 0.3x = 15, so x = 15/0.3 = 50",
        difficulty: 'higher'
      },
      {
        id: "p4",
        question: "What is 12.5% as a fraction in simplest form?",
        options: ["1/8", "1/4", "1/16", "3/16"],
        correctAnswer: 0,
        explanation: "12.5% = 12.5/100 = 125/1000 = 1/8",
        difficulty: 'higher'
      },
      {
        id: "p5",
        question: "A shirt costs £40 after a 20% discount. What was the original price?",
        options: ["£50", "£48", "£45", "£60"],
        correctAnswer: 0,
        explanation: "£40 is 80% of the original. Original = 40 ÷ 0.8 = £50",
        difficulty: 'higher'
      }
    ]
  },
  {
    id: "algebra-basics-8",
    name: "Basic Algebra",
    icon: "x",
    yearLevel: 8,
    questions: [
      {
        id: "a1",
        question: "Simplify: 3x + 5x",
        options: ["8x", "15x", "8x²", "3x + 5"],
        correctAnswer: 0,
        explanation: "Collect like terms: 3x + 5x = 8x",
        difficulty: 'foundation'
      },
      {
        id: "a2",
        question: "Solve: x + 7 = 12",
        options: ["5", "19", "7", "-5"],
        correctAnswer: 0,
        explanation: "Subtract 7 from both sides: x = 12 - 7 = 5",
        difficulty: 'foundation'
      },
      {
        id: "a3",
        question: "Expand: 3(x + 4)",
        options: ["3x + 12", "3x + 4", "x + 12", "3x + 7"],
        correctAnswer: 0,
        explanation: "Multiply each term inside by 3: 3×x + 3×4 = 3x + 12",
        difficulty: 'foundation'
      },
      {
        id: "a4",
        question: "Solve: 2x - 3 = 11",
        options: ["7", "4", "14", "8"],
        correctAnswer: 0,
        explanation: "Add 3: 2x = 14, divide by 2: x = 7",
        difficulty: 'higher'
      },
      {
        id: "a5",
        question: "Factorise: 6x + 9",
        options: ["3(2x + 3)", "6(x + 9)", "3(2x + 9)", "2(3x + 4.5)"],
        correctAnswer: 0,
        explanation: "HCF of 6 and 9 is 3: 3(2x + 3)",
        difficulty: 'higher'
      }
    ]
  },

  // Year 9
  {
    id: "quadratics-9",
    name: "Quadratics",
    icon: "∩",
    yearLevel: 9,
    questions: [
      {
        id: "q1",
        question: "Solve for x: x² - 5x + 6 = 0",
        options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = 0 or x = 5"],
        correctAnswer: 0,
        explanation: "Factor the quadratic: (x - 2)(x - 3) = 0, so x = 2 or x = 3",
        difficulty: 'higher'
      },
      {
        id: "q2",
        question: "What is the vertex of y = x² - 4x + 3?",
        options: ["(2, -1)", "(4, 3)", "(-2, 15)", "(1, 0)"],
        correctAnswer: 0,
        explanation: "Complete the square: y = (x - 2)² - 1, so the vertex is at (2, -1)",
        graphExpression: "y=x^2-4x+3",
        difficulty: 'higher'
      },
      {
        id: "q3",
        question: "Expand (x + 3)(x - 5)",
        options: ["x² - 2x - 15", "x² + 2x - 15", "x² - 8x - 15", "x² - 2x + 15"],
        correctAnswer: 0,
        explanation: "Use FOIL: x² - 5x + 3x - 15 = x² - 2x - 15",
        difficulty: 'foundation'
      },
      {
        id: "q4",
        question: "How many solutions does x² + 4 = 0 have in real numbers?",
        options: ["0 solutions", "1 solution", "2 solutions", "Infinite solutions"],
        correctAnswer: 0,
        explanation: "x² = -4 has no real solutions since x² cannot be negative",
        difficulty: 'higher'
      }
    ]
  },
  {
    id: "straight-line-9",
    name: "Straight Line Graphs",
    icon: "📈",
    yearLevel: 9,
    questions: [
      {
        id: "s1",
        question: "What is the gradient of the line y = 3x + 2?",
        options: ["3", "2", "1", "5"],
        correctAnswer: 0,
        explanation: "In y = mx + c form, m is the gradient, so the gradient is 3",
        difficulty: 'foundation'
      },
      {
        id: "s2",
        question: "What is the y-intercept of y = 2x - 5?",
        options: ["-5", "2", "5", "-2"],
        correctAnswer: 0,
        explanation: "In y = mx + c form, c is the y-intercept, so it's -5",
        difficulty: 'foundation'
      },
      {
        id: "s3",
        question: "A line passes through (0, 3) and (2, 7). What is its gradient?",
        options: ["2", "4", "3", "1"],
        correctAnswer: 0,
        explanation: "Gradient = (7-3)/(2-0) = 4/2 = 2",
        difficulty: 'foundation'
      },
      {
        id: "s4",
        question: "Which line is parallel to y = 2x + 1?",
        options: ["y = 2x - 3", "y = -2x + 1", "y = x + 1", "y = 3x + 1"],
        correctAnswer: 0,
        explanation: "Parallel lines have the same gradient (2)",
        difficulty: 'higher'
      },
      {
        id: "s5",
        question: "What is the equation of a horizontal line through (0, 4)?",
        options: ["y = 4", "x = 4", "y = 0", "x = 0"],
        correctAnswer: 0,
        explanation: "Horizontal lines have the form y = constant, so y = 4",
        difficulty: 'foundation'
      }
    ]
  },

  // Year 10
  {
    id: "trigonometry-10",
    name: "Trigonometry",
    icon: "📐",
    yearLevel: 10,
    questions: [
      {
        id: "t1",
        question: "In a right-angled triangle, if the opposite side is 3 and hypotenuse is 5, what is sin θ?",
        options: ["3/5", "4/5", "3/4", "5/3"],
        correctAnswer: 0,
        explanation: "sin θ = opposite/hypotenuse = 3/5",
        difficulty: 'foundation'
      },
      {
        id: "t2",
        question: "What is the value of cos 60°?",
        options: ["1/2", "√3/2", "1", "0"],
        correctAnswer: 0,
        explanation: "cos 60° = 1/2 (this is a standard angle to remember)",
        difficulty: 'foundation'
      },
      {
        id: "t3",
        question: "If tan θ = 1, what is θ (in degrees, 0° ≤ θ ≤ 90°)?",
        options: ["45°", "30°", "60°", "90°"],
        correctAnswer: 0,
        explanation: "tan 45° = 1 (opposite and adjacent sides are equal)",
        difficulty: 'foundation'
      },
      {
        id: "t4",
        question: "In the equation sin²θ + cos²θ = ?",
        options: ["1", "0", "2", "tan²θ"],
        correctAnswer: 0,
        explanation: "This is the fundamental trigonometric identity: sin²θ + cos²θ = 1",
        difficulty: 'higher'
      },
      {
        id: "t5",
        question: "What is sin 30°?",
        options: ["1/2", "√3/2", "1/√2", "√2/2"],
        correctAnswer: 0,
        explanation: "sin 30° = 1/2 (standard angle)",
        difficulty: 'foundation'
      }
    ]
  },
  {
    id: "divide-fractions-10",
    name: "Dividing Fractions",
    icon: "➗",
    yearLevel: 10,
    questions: [
      {
        id: "df1",
        question: "What is 2/3 ÷ 1/4?",
        options: ["8/3", "2/12", "3/8", "1/6"],
        correctAnswer: 0,
        explanation: "Multiply by the reciprocal: 2/3 × 4/1 = 8/3",
        difficulty: 'foundation'
      },
      {
        id: "df2",
        question: "Simplify: 5/6 ÷ 2/3",
        options: ["5/4", "10/18", "3/4", "5/9"],
        correctAnswer: 0,
        explanation: "5/6 × 3/2 = 15/12 = 5/4",
        difficulty: 'foundation'
      },
      {
        id: "df3",
        question: "What is 3 ÷ 1/2?",
        options: ["6", "3/2", "1/6", "2/3"],
        correctAnswer: 0,
        explanation: "3/1 × 2/1 = 6",
        difficulty: 'foundation'
      },
      {
        id: "df4",
        question: "Calculate: 7/8 ÷ 3/4",
        options: ["7/6", "21/32", "4/6", "7/24"],
        correctAnswer: 0,
        explanation: "7/8 × 4/3 = 28/24 = 7/6",
        difficulty: 'higher'
      },
      {
        id: "df5",
        question: "What is 2 1/2 ÷ 1/3?",
        options: ["15/2", "2/6", "5/6", "3/2"],
        correctAnswer: 0,
        explanation: "2 1/2 = 5/2, then 5/2 × 3/1 = 15/2 = 7.5",
        difficulty: 'higher'
      }
    ]
  },

  // Year 11
  {
    id: "circle-theorems-11",
    name: "Circle Theorems",
    icon: "⭕",
    yearLevel: 11,
    questions: [
      {
        id: "c1",
        question: "The angle in a semicircle is always:",
        options: ["90°", "180°", "45°", "60°"],
        correctAnswer: 0,
        explanation: "The angle in a semicircle theorem states it's always 90°",
        difficulty: 'foundation'
      },
      {
        id: "c2",
        question: "If the angle at the center is 80°, what is the angle at the circumference?",
        options: ["40°", "80°", "160°", "20°"],
        correctAnswer: 0,
        explanation: "The angle at the circumference is half the angle at the center",
        difficulty: 'foundation'
      },
      {
        id: "c3",
        question: "Opposite angles in a cyclic quadrilateral sum to:",
        options: ["180°", "90°", "360°", "270°"],
        correctAnswer: 0,
        explanation: "Opposite angles in a cyclic quadrilateral always sum to 180°",
        difficulty: 'higher'
      },
      {
        id: "c4",
        question: "The angle between a tangent and radius at point of contact is:",
        options: ["90°", "180°", "45°", "0°"],
        correctAnswer: 0,
        explanation: "A tangent always meets a radius at 90° at the point of contact",
        difficulty: 'foundation'
      },
      {
        id: "c5",
        question: "Two tangents from an external point are:",
        options: ["Equal in length", "Different lengths", "Perpendicular", "Parallel"],
        correctAnswer: 0,
        explanation: "The two tangents from an external point to a circle are always equal in length",
        difficulty: 'higher'
      }
    ]
  },
  {
    id: "quadratics-advanced-11",
    name: "Advanced Quadratics",
    icon: "∩",
    yearLevel: 11,
    questions: [
      {
        id: "qa1",
        question: "Complete the square: x² + 6x + 5",
        options: ["(x + 3)² - 4", "(x + 3)² + 5", "(x + 6)² - 31", "(x + 3)² - 9"],
        correctAnswer: 0,
        explanation: "x² + 6x + 9 - 4 = (x + 3)² - 4",
        difficulty: 'higher'
      },
      {
        id: "qa2",
        question: "Using the quadratic formula, solve x² + 3x - 4 = 0",
        options: ["x = 1 or x = -4", "x = 2 or x = -2", "x = 4 or x = -1", "x = 3 or x = -4"],
        correctAnswer: 0,
        explanation: "x = (-3 ± √(9 + 16))/2 = (-3 ± 5)/2, so x = 1 or x = -4",
        difficulty: 'higher'
      },
      {
        id: "qa3",
        question: "What is the discriminant of 2x² - 5x + 3 = 0?",
        options: ["1", "25", "-24", "0"],
        correctAnswer: 0,
        explanation: "b² - 4ac = 25 - 24 = 1",
        difficulty: 'higher'
      },
      {
        id: "qa4",
        question: "The turning point of y = 2(x - 1)² + 3 is:",
        options: ["(1, 3)", "(-1, 3)", "(1, -3)", "(2, 3)"],
        correctAnswer: 0,
        explanation: "In vertex form a(x - h)² + k, the vertex is (h, k) = (1, 3)",
        difficulty: 'higher'
      },
      {
        id: "qa5",
        question: "Solve x² = 25",
        options: ["x = ±5", "x = 5", "x = 12.5", "x = 625"],
        correctAnswer: 0,
        explanation: "Take square root of both sides: x = ±5",
        difficulty: 'foundation'
      }
    ]
  }
];

export const yearLevels = [
  { year: 7, grade: "Year 7", topics: mockTopics.filter(t => t.yearLevel === 7).length },
  { year: 8, grade: "Year 8", topics: mockTopics.filter(t => t.yearLevel === 8).length },
  { year: 9, grade: "Year 9 GCSE", topics: mockTopics.filter(t => t.yearLevel === 9).length },
  { year: 10, grade: "Year 10 GCSE", topics: mockTopics.filter(t => t.yearLevel === 10).length },
  { year: 11, grade: "Year 11 GCSE", topics: mockTopics.filter(t => t.yearLevel === 11).length },
];
