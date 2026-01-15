import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'printables_db';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGO_URL, {
    maxPoolSize: 10,
    minPoolSize: 5,
  });

  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// Initialize indexes
export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();
    
    // Categories indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('categories').createIndex({ name: 1 });
    
    // Printables indexes
    await db.collection('printables').createIndex({ slug: 1 }, { unique: true });
    await db.collection('printables').createIndex({ category_id: 1 });
    await db.collection('printables').createIndex({ title: 'text', description: 'text', tags: 'text' });
    await db.collection('printables').createIndex({ createdAt: -1 });
    
    // Pages indexes
    await db.collection('pages').createIndex({ slug: 1 }, { unique: true });
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    console.log('Database indexes initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}