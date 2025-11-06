import { type User, type InsertUser, type Topic } from "@shared/schema";
import { randomUUID } from "crypto";
import { getDatabase } from "./db";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quiz methods
  getAllTopics(): Promise<Topic[]>;
  getTopicsByYear(yearLevel: number): Promise<Topic[]>;
  getTopicById(topicId: string): Promise<Topic | undefined>;
  saveTopic(topic: Topic): Promise<void>;
  deleteTopic(topicId: string): Promise<void>;
  updateTopic(topic: Topic): Promise<void>;
}

export class MongoStorage implements IStorage {
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Don't call ensureInitialized in constructor
  }

  private async ensureInitialized() {
    if (this.initialized) return;
    
    // Prevent multiple simultaneous initializations
    if (this.initPromise) {
      return this.initPromise;
    }
    
    this.initPromise = (async () => {
      try {
        const db = getDatabase();
        const topicsCount = await db.collection('topics').countDocuments();
        
        // If no topics exist, initialize with default data
        if (topicsCount === 0) {
          console.log('Initializing database with default quiz data...');
          await this.initializeQuizData();
        }
        
        this.initialized = true;
      } catch (error) {
        console.error('Error initializing storage:', error);
        throw error;
      }
    })();
    
    return this.initPromise;
  }

  private initializeQuizData() {
    // Initialize quiz topics with questions
    const quizTopics: Topic[] = [
      {
        id: "quadratics-9",
        name: "Quadratics",
        icon: "circle",
        yearLevel: 9,
        questions: [
          {
            id: "q1",
            question: "Solve for x: x² - 5x + 6 = 0",
            options: ["x = 2 or x = 3", "x = 1 or x = 6", "x = -2 or x = -3", "x = 0 or x = 5"],
            correctAnswer: 0,
            explanation: "Factor the quadratic: (x - 2)(x - 3) = 0, so x = 2 or x = 3"
          },
          {
            id: "q2",
            question: "What is the vertex of y = x² - 4x + 3?",
            options: ["(2, -1)", "(4, 3)", "(-2, 15)", "(1, 0)"],
            correctAnswer: 0,
            explanation: "Complete the square: y = (x - 2)² - 1, so the vertex is at (2, -1)"
          },
          {
            id: "q3",
            question: "Expand (x + 3)(x - 5)",
            options: ["x² - 2x - 15", "x² + 2x - 15", "x² - 8x - 15", "x² - 2x + 15"],
            correctAnswer: 0,
            explanation: "Use FOIL: x² - 5x + 3x - 15 = x² - 2x - 15"
          },
          {
            id: "q4",
            question: "How many solutions does x² + 4 = 0 have in real numbers?",
            options: ["0 solutions", "1 solution", "2 solutions", "Infinite solutions"],
            correctAnswer: 0,
            explanation: "x² = -4 has no real solutions since x² cannot be negative"
          },
          {
            id: "q5",
            question: "What is the discriminant of 2x² + 3x - 2 = 0?",
            options: ["25", "17", "13", "5"],
            correctAnswer: 0,
            explanation: "Discriminant = b² - 4ac = 3² - 4(2)(-2) = 9 + 16 = 25"
          }
        ]
      },
      {
        id: "trigonometry-10",
        name: "Trigonometry",
        icon: "triangle",
        yearLevel: 10,
        questions: [
          {
            id: "t1",
            question: "In a right-angled triangle, if the opposite side is 3 and hypotenuse is 5, what is sin θ?",
            options: ["3/5", "4/5", "3/4", "5/3"],
            correctAnswer: 0,
            explanation: "sin θ = opposite/hypotenuse = 3/5"
          },
          {
            id: "t2",
            question: "What is the value of cos 60°?",
            options: ["1/2", "√3/2", "1", "0"],
            correctAnswer: 0,
            explanation: "cos 60° = 1/2 (this is a standard angle to remember)"
          },
          {
            id: "t3",
            question: "If tan θ = 1, what is θ (in degrees, 0° ≤ θ ≤ 90°)?",
            options: ["45°", "30°", "60°", "90°"],
            correctAnswer: 0,
            explanation: "tan 45° = 1 (opposite and adjacent sides are equal)"
          },
          {
            id: "t4",
            question: "In the equation sin²θ + cos²θ = ?",
            options: ["1", "0", "2", "tan²θ"],
            correctAnswer: 0,
            explanation: "This is the fundamental trigonometric identity: sin²θ + cos²θ = 1"
          },
          {
            id: "t5",
            question: "What is sin 30°?",
            options: ["1/2", "√3/2", "1/√2", "√2/2"],
            correctAnswer: 0,
            explanation: "sin 30° = 1/2 (standard angle)"
          }
        ]
      },
      {
        id: "percentages-8",
        name: "Percentages",
        icon: "percent",
        yearLevel: 8,
        questions: [
          {
            id: "p1",
            question: "What is 25% of 80?",
            options: ["20", "25", "30", "15"],
            correctAnswer: 0,
            explanation: "25% = 1/4, so 1/4 × 80 = 20"
          },
          {
            id: "p2",
            question: "A price increased from £50 to £60. What is the percentage increase?",
            options: ["20%", "10%", "25%", "15%"],
            correctAnswer: 0,
            explanation: "Increase = £10. Percentage = (10/50) × 100 = 20%"
          },
          {
            id: "p3",
            question: "If 30% of a number is 15, what is the number?",
            options: ["50", "45", "60", "40"],
            correctAnswer: 0,
            explanation: "Let x be the number: 0.3x = 15, so x = 15/0.3 = 50"
          },
          {
            id: "p4",
            question: "What is 12.5% as a fraction in simplest form?",
            options: ["1/8", "1/4", "1/16", "3/16"],
            correctAnswer: 0,
            explanation: "12.5% = 12.5/100 = 125/1000 = 1/8"
          },
          {
            id: "p5",
            question: "A shirt costs £40 after a 20% discount. What was the original price?",
            options: ["£50", "£48", "£45", "£60"],
            correctAnswer: 0,
            explanation: "£40 is 80% of the original. Original = 40 ÷ 0.8 = £50"
          }
        ]
      },
      {
        id: "fractions-7",
        name: "Fractions",
        icon: "divide",
        yearLevel: 7,
        questions: [
          {
            id: "f1",
            question: "Simplify: 2/3 + 1/6",
            options: ["5/6", "3/9", "1/2", "2/3"],
            correctAnswer: 0,
            explanation: "2/3 = 4/6, so 4/6 + 1/6 = 5/6"
          },
          {
            id: "f2",
            question: "What is 3/4 × 2/5?",
            options: ["3/10", "6/20", "5/9", "1/2"],
            correctAnswer: 0,
            explanation: "Multiply numerators and denominators: (3×2)/(4×5) = 6/20 = 3/10"
          },
          {
            id: "f3",
            question: "What is 1/2 ÷ 1/4?",
            options: ["2", "1/8", "1/6", "4"],
            correctAnswer: 0,
            explanation: "Dividing by a fraction means multiplying by its reciprocal: 1/2 × 4/1 = 2"
          },
          {
            id: "f4",
            question: "Convert 0.75 to a fraction in simplest form",
            options: ["3/4", "7/10", "75/100", "15/20"],
            correctAnswer: 0,
            explanation: "0.75 = 75/100 = 3/4 (divide by 25)"
          },
          {
            id: "f5",
            question: "Which is larger: 2/3 or 3/5?",
            options: ["2/3", "3/5", "They are equal", "Cannot compare"],
            correctAnswer: 0,
            explanation: "Convert to same denominator: 2/3 = 10/15 and 3/5 = 9/15, so 2/3 is larger"
          }
        ]
      },
      {
        id: "straight-line-9",
        name: "Straight Line Graphs",
        icon: "trending",
        yearLevel: 9,
        questions: [
          {
            id: "s1",
            question: "What is the gradient of the line y = 3x + 2?",
            options: ["3", "2", "1", "5"],
            correctAnswer: 0,
            explanation: "In y = mx + c form, m is the gradient, so the gradient is 3"
          },
          {
            id: "s2",
            question: "What is the y-intercept of y = 2x - 5?",
            options: ["-5", "2", "5", "-2"],
            correctAnswer: 0,
            explanation: "In y = mx + c form, c is the y-intercept, so it's -5"
          },
          {
            id: "s3",
            question: "A line passes through (0, 3) and (2, 7). What is its gradient?",
            options: ["2", "4", "3", "1"],
            correctAnswer: 0,
            explanation: "Gradient = (7-3)/(2-0) = 4/2 = 2"
          },
          {
            id: "s4",
            question: "Which line is parallel to y = 2x + 1?",
            options: ["y = 2x - 3", "y = -2x + 1", "y = x + 1", "y = 3x + 1"],
            correctAnswer: 0,
            explanation: "Parallel lines have the same gradient (2)"
          },
          {
            id: "s5",
            question: "What is the equation of a horizontal line through (0, 4)?",
            options: ["y = 4", "x = 4", "y = 0", "x = 0"],
            correctAnswer: 0,
            explanation: "Horizontal lines have the form y = constant, so y = 4"
          }
        ]
      },
      {
        id: "circle-theorems-11",
        name: "Circle Theorems",
        icon: "circle",
        yearLevel: 11,
        questions: [
          {
            id: "c1",
            question: "The angle in a semicircle is always:",
            options: ["90°", "180°", "45°", "60°"],
            correctAnswer: 0,
            explanation: "The angle in a semicircle theorem states it's always 90°"
          },
          {
            id: "c2",
            question: "If the angle at the center is 80°, what is the angle at the circumference?",
            options: ["40°", "80°", "160°", "20°"],
            correctAnswer: 0,
            explanation: "The angle at the circumference is half the angle at the center"
          },
          {
            id: "c3",
            question: "Opposite angles in a cyclic quadrilateral sum to:",
            options: ["180°", "90°", "360°", "270°"],
            correctAnswer: 0,
            explanation: "Opposite angles in a cyclic quadrilateral always sum to 180°"
          },
          {
            id: "c4",
            question: "The angle between a tangent and radius at point of contact is:",
            options: ["90°", "180°", "45°", "0°"],
            correctAnswer: 0,
            explanation: "A tangent always meets a radius at 90° at the point of contact"
          },
          {
            id: "c5",
            question: "Two tangents from an external point are:",
            options: ["Equal in length", "Different lengths", "Perpendicular", "Parallel"],
            correctAnswer: 0,
            explanation: "The two tangents from an external point to a circle are always equal in length"
          }
        ]
      }
    ];

    quizTopics.forEach(async (topic) => {
      const db = getDatabase();
      await db.collection('topics').insertOne(topic);
    });
    console.log('✅ Default quiz data initialized');
  }

  async getUser(id: string): Promise<User | undefined> {
    const db = getDatabase();
    const user = await db.collection<User>('users').findOne({ id });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = getDatabase();
    const user = await db.collection<User>('users').findOne({ username });
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    const db = getDatabase();
    await db.collection('users').insertOne(user);
    return user;
  }

  async getAllTopics(): Promise<Topic[]> {
    await this.ensureInitialized();
    const db = getDatabase();
    const topics = await db.collection<Topic>('topics').find({}).toArray();
    return topics;
  }

  async getTopicsByYear(yearLevel: number): Promise<Topic[]> {
    await this.ensureInitialized();
    const db = getDatabase();
    const topics = await db.collection<Topic>('topics').find({ yearLevel }).toArray();
    return topics;
  }

  async getTopicById(topicId: string): Promise<Topic | undefined> {
    await this.ensureInitialized();
    const db = getDatabase();
    const topic = await db.collection<Topic>('topics').findOne({ id: topicId });
    return topic || undefined;
  }

  async saveTopic(topic: Topic): Promise<void> {
    const db = getDatabase();
    await db.collection('topics').updateOne(
      { id: topic.id },
      { $set: topic },
      { upsert: true }
    );
  }

  async deleteTopic(topicId: string): Promise<void> {
    const db = getDatabase();
    await db.collection('topics').deleteOne({ id: topicId });
  }

  async updateTopic(topic: Topic): Promise<void> {
    const db = getDatabase();
    await db.collection('topics').updateOne(
      { id: topic.id },
      { $set: topic }
    );
  }
}

export const storage = new MongoStorage();
