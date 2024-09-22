import { relations } from "drizzle-orm";
import { boolean, date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user";

export const measures = pgTable("measure", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("customer_code").notNull(),
  measureDatetime: date("measure_datetime").notNull(),
  measureType: text("measure_type").notNull(),
  imageUrl: text("image_url"),
  hasConfirmed: boolean("has_confirmed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const measureUser = relations(measures, ({ one }) => ({
  customer: one(users, {
    fields: [measures.userId],
    references: [users.id],
  }),
}));

export type Measure = typeof measures.$inferSelect;
export type NewMwasure = typeof measures.$inferInsert;
