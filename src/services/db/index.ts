import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users } from "./schemas/user";

const connectionString = process.env.DATABASE_URL as string;
const client = postgres(connectionString, { max: 1 });

export const db = drizzle(client, { schema: { users } });
