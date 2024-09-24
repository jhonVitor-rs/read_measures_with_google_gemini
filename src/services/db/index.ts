import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "./schemas/user";
import { measures } from "./schemas/measure";

const connectionString = process.env.DATABASE_URL as string;
const client = new Pool({ connectionString });

export const db = drizzle(client, { schema: { users, measures } });
