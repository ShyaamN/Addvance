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
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string; // For uploaded images (graphs, diagrams)
  graphExpression?: string; // For Desmos graph rendering
  difficulty?: 'foundation' | 'higher'; // Foundation or Higher tier
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  yearLevel: number;
  questions: Question[];
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
