import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "@src/env";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });

export async function checkDbConnection() {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (err) {
    throw new Error(`Database connection failed: ${err}`);
  }
}
