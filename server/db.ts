import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://addvancemathsdev_db_user:6FfbJfZIZnl5ElL6@cluster0.yjnohgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'addvance_maths';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { db, client };
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Create indexes
    await db.collection('topics').createIndex({ id: 1 }, { unique: true });
    await db.collection('progress').createIndex({ userId: 1 });
    
    return { db, client };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
