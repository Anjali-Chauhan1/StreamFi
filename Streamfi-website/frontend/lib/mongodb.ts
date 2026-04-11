import { MongoClient, Db } from "mongodb";

const globalForMongo = global as unknown as {
  mongoClient?: MongoClient;
  mongoDb?: Db;
};

function getMongoUri() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is not set");
  }
  return uri;
}

function resolveDbName(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const pathname = url.pathname.replace(/^\//, "").trim();
    return pathname || "streamfi";
  } catch {
    return "streamfi";
  }
}

export async function getMongoDb() {
  if (globalForMongo.mongoDb) {
    return globalForMongo.mongoDb;
  }

  const uri = getMongoUri();

  const client = globalForMongo.mongoClient || new MongoClient(uri);
  if (!globalForMongo.mongoClient) {
    await client.connect();
    globalForMongo.mongoClient = client;
  }

  const db = client.db(resolveDbName(uri));
  globalForMongo.mongoDb = db;
  return db;
}
