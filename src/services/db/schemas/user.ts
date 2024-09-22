import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { measures } from "./measure";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userMeasures = relations(users, ({ many }) => ({
  measures: many(measures),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
