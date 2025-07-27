import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;
export default clientPromise;


// lib/mongoose.ts

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI!;

// if (!MONGODB_URI) {
//   throw new Error('❌ Please define the MONGODB_URI environment variable');
// }

// // Use a global variable to cache the connection in dev (avoid hot reload issues)
// let cached = global.mongoose as {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// };

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;
