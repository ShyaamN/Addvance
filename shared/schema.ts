import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Quiz types
export type QuestionMode = 'quiz' | 'drill' | 'flashcard' | 'starter';

// Difficulty scale: 1 (easiest/Year 7) to 6 (hardest/Grade 9 GCSE)
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string; // For uploaded images (graphs, diagrams)
  graphExpression?: string; // For Desmos graph rendering
  difficulty: DifficultyLevel; // 1 (easy) to 6 (GCSE Grade 9)
  mode?: QuestionMode; // Quiz, Drill, Flashcard, or Starter
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  yearLevel: number;
  questions: Question[];
  category?: string; // e.g., "Algebra", "Geometry", "Number"
  mode?: QuestionMode; // Default mode for this topic
}

export interface QuizSession {
  topicId: string;
  topicName: string;
  currentQuestionIndex: number;
  answers: (number | null)[];
  score: number;
  timeRemaining: number;
  isComplete: boolean;
}
