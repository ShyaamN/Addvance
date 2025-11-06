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

  private async initializeQuizData() {
    console.log("Initializing database with default quiz data...");
    
    // Import initial data with all organizational fields (category, mode, difficulty)
    const { initialTopics } = await import('./initialData');

    const db = getDatabase();
    await db.collection('topics').insertMany(initialTopics);
    console.log(`✅ Initialized database with ${initialTopics.length} topics with full organizational structure`);
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
