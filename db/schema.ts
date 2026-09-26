import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  priority: text("priority"),
  category: text("category"),
  summary: text("summary"),
  draftReply: text("draft_reply"),
  analyzedAt: timestamp("analyzed_at"),
});

export type Ticket = typeof tickets.$inferSelect;
