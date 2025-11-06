import { MongoClient } from 'mongodb';
import type { Topic, DifficultyLevel } from '../shared/schema';

// MongoDB connection
const uri = 'mongodb+srv://addvancemathsdev_db_user:6FfbJfZIZnl5ElL6@cluster0.yjnohgw.mongodb.net/';
const dbName = 'addvance_maths';

// Map old difficulty to new 1-6 scale based on year level and complexity
function mapDifficulty(oldDifficulty: string | undefined, yearLevel: number, questionComplexity: string): DifficultyLevel {
  // Base difficulty on year level
  const baseLevel = Math.min(yearLevel - 6, 5); // Year 7 = 1, Year 11 = 5
  
  if (oldDifficulty === 'foundation' || questionComplexity === 'basic') {
    return Math.max(1, baseLevel) as DifficultyLevel;
  } else if (oldDifficulty === 'higher' || questionComplexity === 'advanced') {
    return Math.min(6, baseLevel + 1) as DifficultyLevel;
  }
  
  return baseLevel as DifficultyLevel;
}

// All quiz data with proper categorization and difficulty mapping
const allTopics: Topic[] = [
  // Year 7 - Foundation level (Difficulty 1-2)
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
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "f2",
        question: "What is 3/4 × 2/5?",
        options: ["3/10", "6/20", "5/9", "1/2"],
        correctAnswer: 0,
        explanation: "Multiply numerators and denominators: (3×2)/(4×5) = 6/20 = 3/10",
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "f3",
        question: "What is 1/2 ÷ 1/4?",
        options: ["2", "1/8", "1/6", "4"],
        correctAnswer: 0,
        explanation: "Dividing by a fraction means multiplying by its reciprocal: 1/2 × 4/1 = 2",
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "f4",
        question: "Convert 0.75 to a fraction in simplest form",
        options: ["3/4", "7/10", "75/100", "15/20"],
        correctAnswer: 0,
        explanation: "0.75 = 75/100 = 3/4 (divide by 25)",
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "f5",
        question: "Which is larger: 2/3 or 3/5?",
        options: ["2/3", "3/5", "They are equal", "Cannot compare"],
        correctAnswer: 0,
        explanation: "Convert to same denominator: 2/3 = 10/15 and 3/5 = 9/15, so 2/3 is larger",
        difficulty: 2,
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
        question: "What is 2.5 + 3.75?",
        options: ["6.25", "6.5", "5.25", "6.75"],
        correctAnswer: 0,
        explanation: "Line up decimal points: 2.50 + 3.75 = 6.25",
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "d2",
        question: "What is 0.6 × 0.4?",
        options: ["0.24", "2.4", "0.024", "24"],
        correctAnswer: 0,
        explanation: "6 × 4 = 24, with 2 decimal places: 0.24",
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "d3",
        question: "Round 4.567 to 2 decimal places",
        options: ["4.57", "4.56", "4.6", "5"],
        correctAnswer: 0,
        explanation: "Look at the third decimal place (7), round up: 4.57",
        difficulty: 1,
        mode: 'quiz'
      },
      {
        id: "d4",
        question: "What is 8.4 ÷ 0.2?",
        options: ["42", "4.2", "420", "0.42"],
        correctAnswer: 0,
        explanation: "Multiply both by 10: 84 ÷ 2 = 42",
        difficulty: 2,
        mode: 'quiz'
      },
      {
        id: "d5",
        question: "Express 0.125 as a fraction",
        options: ["1/8", "1/4", "1/16", "3/8"],
        correctAnswer: 0,
        explanation: "0.125 = 125/1000 = 1/8",
        difficulty: 2,
        mode: 'quiz'
      }
    ]
  },

  // Year 8 - Early GCSE (Difficulty 2-3)
  {
    id: "percentages-8",
    name: "Percentages",
    icon: "%",
    yearLevel: 8,
    category: "Number",
    mode: "quiz",
    questions: [
      {
        id: "p1",
        question: "What is 25% of 80?",
        options: ["20", "25", "30", "15"],
        correctAnswer: 0,
        explanation: "25% = 1/4, so 1/4 × 80 = 20",
        difficulty: 2,
        mode: 'quiz'
      },
      {
        id: "p2",
        question: "A price increased from £50 to £60. What is the percentage increase?",
        options: ["20%", "10%", "25%", "15%"],
        correctAnswer: 0,
        explanation: "Increase = £10. Percentage = (10/50) × 100 = 20%",
        difficulty: 2,
        mode: 'quiz'
      },
      {
        id: "p3",
        question: "If 30% of a number is 15, what is the number?",
        options: ["50", "45", "60", "40"],
        correctAnswer: 0,
        explanation: "Let x be the number: 0.3x = 15, so x = 15/0.3 = 50",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "p4",
        question: "What is 12.5% as a fraction in simplest form?",
        options: ["1/8", "1/4", "1/16", "3/16"],
        correctAnswer: 0,
        explanation: "12.5% = 12.5/100 = 125/1000 = 1/8",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "p5",
        question: "A shirt costs £40 after a 20% discount. What was the original price?",
        options: ["£50", "£48", "£45", "£60"],
        correctAnswer: 0,
        explanation: "£40 is 80% of the original. Original = 40 ÷ 0.8 = £50",
        difficulty: 3,
        mode: 'quiz'
      }
    ]
  },
  {
    id: "algebra-basics-8",
    name: "Basic Algebra",
    icon: "x",
    yearLevel: 8,
    category: "Algebra",
    mode: "quiz",
    questions: [
      {
        id: "a1",
        question: "Simplify: 3x + 5x",
        options: ["8x", "15x", "8x²", "3x + 5"],
        correctAnswer: 0,
        explanation: "Collect like terms: 3x + 5x = 8x",
        difficulty: 2,
        mode: 'quiz'
      },
      {
        id: "a2",
        question: "Solve: x + 7 = 12",
        options: ["5", "19", "7", "-5"],
        correctAnswer: 0,
        explanation: "Subtract 7 from both sides: x = 12 - 7 = 5",
        graphExpression: "y=x+7; y=12",
        difficulty: 2,
        mode: 'quiz'
      },
      {
        id: "a3",
        question: "Expand: 3(x + 4)",
        options: ["3x + 12", "3x + 4", "x + 12", "3x + 7"],
        correctAnswer: 0,
        explanation: "Multiply each term inside by 3: 3×x + 3×4 = 3x + 12",
        difficulty: 2,
        mode: 'quiz'
      },
      {
        id: "a4",
        question: "Solve: 2x - 3 = 11",
        options: ["7", "4", "14", "8"],
        correctAnswer: 0,
        explanation: "Add 3: 2x = 14, divide by 2: x = 7",
        graphExpression: "y=2x-3; y=11",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "a5",
        question: "Factorise: 6x + 9",
        options: ["3(2x + 3)", "6(x + 9)", "3(2x + 9)", "2(3x + 4.5)"],
        correctAnswer: 0,
        explanation: "HCF of 6 and 9 is 3: 3(2x + 3)",
        difficulty: 3,
        mode: 'quiz'
      }
    ]
  },

  // Year 9 - Mid GCSE (Difficulty 3-4)
  {
    id: "quadratics-9",
    name: "Quadratics",
    icon: "∩",
    yearLevel: 9,
    category: "Algebra",
    mode: "quiz",
    questions: [
      {
        id: "q1",
        question: "Solve for x: x² - 5x + 6 = 0",
        options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = 0 or x = 5"],
        correctAnswer: 0,
        explanation: "Factor the quadratic: (x - 2)(x - 3) = 0, so x = 2 or x = 3",
        graphExpression: "y=x^2-5x+6",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "q2",
        question: "What is the vertex of y = x² - 4x + 3?",
        options: ["(2, -1)", "(4, 3)", "(-2, 15)", "(1, 0)"],
        correctAnswer: 0,
        explanation: "Complete the square: y = (x - 2)² - 1, so the vertex is at (2, -1)",
        graphExpression: "y=x^2-4x+3",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "q3",
        question: "Expand (x + 3)(x - 5)",
        options: ["x² - 2x - 15", "x² + 2x - 15", "x² - 8x - 15", "x² - 2x + 15"],
        correctAnswer: 0,
        explanation: "Use FOIL: x² - 5x + 3x - 15 = x² - 2x - 15",
        graphExpression: "y=x^2-2x-15",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "q4",
        question: "How many solutions does x² + 4 = 0 have in real numbers?",
        options: ["0 solutions", "1 solution", "2 solutions", "Infinite solutions"],
        correctAnswer: 0,
        explanation: "x² = -4 has no real solutions since x² cannot be negative",
        difficulty: 4,
        mode: 'quiz'
      }
    ]
  },
  {
    id: "straight-line-9",
    name: "Straight Line Graphs",
    icon: "📈",
    yearLevel: 9,
    category: "Algebra",
    mode: "quiz",
    questions: [
      {
        id: "s1",
        question: "What is the gradient of the line y = 3x + 2?",
        options: ["3", "2", "1", "5"],
        correctAnswer: 0,
        explanation: "In y = mx + c form, m is the gradient, so the gradient is 3",
        graphExpression: "y=3x+2",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "s2",
        question: "What is the y-intercept of y = 2x - 5?",
        options: ["-5", "2", "5", "-2"],
        correctAnswer: 0,
        explanation: "In y = mx + c form, c is the y-intercept, so it's -5",
        graphExpression: "y=2x-5",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "s3",
        question: "A line passes through (0, 3) and (2, 7). What is its gradient?",
        options: ["2", "4", "3", "1"],
        correctAnswer: 0,
        explanation: "Gradient = (7-3)/(2-0) = 4/2 = 2",
        difficulty: 3,
        mode: 'quiz'
      },
      {
        id: "s4",
        question: "Which line is parallel to y = 2x + 1?",
        options: ["y = 2x - 3", "y = -2x + 1", "y = x + 1", "y = 3x + 1"],
        correctAnswer: 0,
        explanation: "Parallel lines have the same gradient (2)",
        graphExpression: "y=2x+1; y=2x-3",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "s5",
        question: "What is the equation of a horizontal line through (0, 4)?",
        options: ["y = 4", "x = 4", "y = 0", "x = 0"],
        correctAnswer: 0,
        explanation: "Horizontal lines have the form y = constant, so y = 4",
        graphExpression: "y=4",
        difficulty: 3,
        mode: 'quiz'
      }
    ]
  },

  // Year 10 - Upper GCSE (Difficulty 4-5)
  {
    id: "trigonometry-10",
    name: "Trigonometry",
    icon: "📐",
    yearLevel: 10,
    category: "Geometry",
    mode: "quiz",
    questions: [
      {
        id: "t1",
        question: "In a right-angled triangle, if the opposite side is 3 and hypotenuse is 5, what is sin θ?",
        options: ["3/5", "4/5", "3/4", "5/3"],
        correctAnswer: 0,
        explanation: "sin θ = opposite/hypotenuse = 3/5",
        graphExpression: "y=\\sin(x)",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "t2",
        question: "What is the value of cos 60°?",
        options: ["1/2", "√3/2", "1", "0"],
        correctAnswer: 0,
        explanation: "cos 60° = 1/2 (this is a standard angle to remember)",
        graphExpression: "y=\\cos(x)",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "t3",
        question: "If tan θ = 1, what is θ (in degrees, 0° ≤ θ ≤ 90°)?",
        options: ["45°", "30°", "60°", "90°"],
        correctAnswer: 0,
        explanation: "tan 45° = 1 (opposite and adjacent sides are equal)",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "t4",
        question: "In the equation sin²θ + cos²θ = ?",
        options: ["1", "0", "2", "tan²θ"],
        correctAnswer: 0,
        explanation: "This is the fundamental trigonometric identity: sin²θ + cos²θ = 1",
        difficulty: 5,
        mode: 'quiz'
      },
      {
        id: "t5",
        question: "What is sin 30°?",
        options: ["1/2", "√3/2", "1/√2", "√2/2"],
        correctAnswer: 0,
        explanation: "sin 30° = 1/2 (standard angle)",
        difficulty: 4,
        mode: 'quiz'
      }
    ]
  },
  {
    id: "divide-fractions-10",
    name: "Dividing Fractions",
    icon: "➗",
    yearLevel: 10,
    category: "Number",
    mode: "quiz",
    questions: [
      {
        id: "df1",
        question: "What is 2/3 ÷ 1/4?",
        options: ["8/3", "2/12", "3/8", "1/6"],
        correctAnswer: 0,
        explanation: "Multiply by the reciprocal: 2/3 × 4/1 = 8/3",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "df2",
        question: "Simplify: 5/6 ÷ 2/3",
        options: ["5/4", "10/18", "3/4", "5/9"],
        correctAnswer: 0,
        explanation: "5/6 × 3/2 = 15/12 = 5/4",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "df3",
        question: "What is 3 ÷ 1/2?",
        options: ["6", "3/2", "1/6", "2/3"],
        correctAnswer: 0,
        explanation: "3/1 × 2/1 = 6",
        difficulty: 4,
        mode: 'quiz'
      },
      {
        id: "df4",
        question: "Calculate: 7/8 ÷ 3/4",
        options: ["7/6", "21/32", "4/6", "7/24"],
        correctAnswer: 0,
        explanation: "7/8 × 4/3 = 28/24 = 7/6",
        difficulty: 5,
        mode: 'quiz'
      },
      {
        id: "df5",
        question: "What is 2 1/2 ÷ 1/3?",
        options: ["15/2", "2/6", "5/6", "3/2"],
        correctAnswer: 0,
        explanation: "2 1/2 = 5/2, then 5/2 × 3/1 = 15/2 = 7.5",
        difficulty: 5,
        mode: 'quiz'
      }
    ]
  },

  // Year 11 - Advanced GCSE (Difficulty 5-6)
  {
    id: "circle-theorems-11",
    name: "Circle Theorems",
    icon: "⭕",
    yearLevel: 11,
    category: "Geometry",
    mode: "quiz",
    questions: [
      {
        id: "c1",
        question: "The angle in a semicircle is always:",
        options: ["90°", "180°", "45°", "60°"],
        correctAnswer: 0,
        explanation: "The angle in a semicircle theorem states it's always 90°",
        graphExpression: "x^2+y^2=1; y=0; x\\ge0",
        difficulty: 5,
        mode: 'quiz'
      },
      {
        id: "c2",
        question: "If the angle at the center is 80°, what is the angle at the circumference?",
        options: ["40°", "80°", "160°", "20°"],
        correctAnswer: 0,
        explanation: "The angle at the circumference is half the angle at the center",
        difficulty: 5,
        mode: 'quiz'
      },
      {
        id: "c3",
        question: "Opposite angles in a cyclic quadrilateral sum to:",
        options: ["180°", "90°", "360°", "270°"],
        correctAnswer: 0,
        explanation: "Opposite angles in a cyclic quadrilateral always sum to 180°",
        difficulty: 5,
        mode: 'quiz'
      },
      {
        id: "c4",
        question: "The angle between a tangent and radius at point of contact is:",
        options: ["90°", "180°", "45°", "0°"],
        correctAnswer: 0,
        explanation: "A tangent always meets a radius at 90° at the point of contact",
        difficulty: 5,
        mode: 'quiz'
      },
      {
        id: "c5",
        question: "Two tangents from an external point are:",
        options: ["Equal in length", "Different lengths", "Perpendicular", "Parallel"],
        correctAnswer: 0,
        explanation: "The two tangents from an external point to a circle are always equal in length",
        difficulty: 5,
        mode: 'quiz'
      }
    ]
  },
  {
    id: "quadratics-advanced-11",
    name: "Advanced Quadratics",
    icon: "∩",
    yearLevel: 11,
    category: "Algebra",
    mode: "quiz",
    questions: [
      {
        id: "qa1",
        question: "Complete the square: x² + 6x + 5",
        options: ["(x + 3)² - 4", "(x + 3)² + 5", "(x + 6)² - 31", "(x + 3)² - 9"],
        correctAnswer: 0,
        explanation: "x² + 6x + 9 - 4 = (x + 3)² - 4",
        graphExpression: "y=x^2+6x+5; y=(x+3)^2-4",
        difficulty: 6,
        mode: 'quiz'
      },
      {
        id: "qa2",
        question: "Using the quadratic formula, solve x² + 3x - 4 = 0",
        options: ["x = 1 or x = -4", "x = 2 or x = -2", "x = 4 or x = -1", "x = 3 or x = -4"],
        correctAnswer: 0,
        explanation: "x = (-3 ± √(9 + 16))/2 = (-3 ± 5)/2, so x = 1 or x = -4",
        graphExpression: "y=x^2+3x-4",
        difficulty: 6,
        mode: 'quiz'
      },
      {
        id: "qa3",
        question: "What is the discriminant of 2x² - 5x + 3 = 0?",
        options: ["1", "25", "-24", "0"],
        correctAnswer: 0,
        explanation: "b² - 4ac = 25 - 24 = 1",
        difficulty: 6,
        mode: 'quiz'
      },
      {
        id: "qa4",
        question: "The turning point of y = 2(x - 1)² + 3 is:",
        options: ["(1, 3)", "(-1, 3)", "(1, -3)", "(2, 3)"],
        correctAnswer: 0,
        explanation: "In vertex form a(x - h)² + k, the vertex is (h, k) = (1, 3)",
        graphExpression: "y=2(x-1)^2+3",
        difficulty: 6,
        mode: 'quiz'
      },
      {
        id: "qa5",
        question: "Solve x² = 25",
        options: ["x = ±5", "x = 5", "x = 12.5", "x = 625"],
        correctAnswer: 0,
        explanation: "Take square root of both sides: x = ±5",
        graphExpression: "y=x^2; y=25",
        difficulty: 5,
        mode: 'quiz'
      }
    ]
  }
];

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(dbName);
    const topicsCollection = db.collection('topics');
    
    // Clear existing topics
    const deleteResult = await topicsCollection.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing topics`);
    
    // Insert all topics
    const insertResult = await topicsCollection.insertMany(allTopics);
    console.log(`✅ Inserted ${insertResult.insertedCount} topics`);
    
    // Show summary
    const summary = allTopics.reduce((acc, topic) => {
      acc.totalQuestions += topic.questions.length;
      acc.byYear[topic.yearLevel] = (acc.byYear[topic.yearLevel] || 0) + 1;
      acc.byCategory[topic.category || 'Other'] = (acc.byCategory[topic.category || 'Other'] || 0) + 1;
      return acc;
    }, { totalQuestions: 0, byYear: {} as Record<number, number>, byCategory: {} as Record<string, number> });
    
    console.log('\n📊 Database Summary:');
    console.log(`   Total Topics: ${allTopics.length}`);
    console.log(`   Total Questions: ${summary.totalQuestions}`);
    console.log(`   By Year Level:`, summary.byYear);
    console.log(`   By Category:`, summary.byCategory);
    
    // Verify difficulty distribution
    const difficultyCount: Record<number, number> = {};
    allTopics.forEach(topic => {
      topic.questions.forEach(q => {
        difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1;
      });
    });
    console.log(`   Difficulty Distribution:`, difficultyCount);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n✅ Database seeding complete!');
  }
}

// Run the seeding
seedDatabase().catch(console.error);
