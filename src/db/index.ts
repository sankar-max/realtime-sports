import dotenv from "dotenv";
dotenv.config();
import "dotenv";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const client = new pg.Pool({ connectionString });

export const db = drizzle(client);
