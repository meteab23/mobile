import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const watchlist = sqliteTable("watchlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ticker: text("ticker").notNull().unique(),
  addedAt: integer("added_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const signalHistory = sqliteTable("signal_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ticker: text("ticker").notNull(),
  signalType: text("signal_type").notNull(),
  price: real("price").notNull(),
  entry: real("entry"),
  stopLoss: real("stop_loss"),
  takeProfit1: real("take_profit_1"),
  takeProfit2: real("take_profit_2"),
  confidence: real("confidence"),
  reason: text("reason"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const analysisCache = sqliteTable("analysis_cache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ticker: text("ticker").notNull(),
  payload: text("payload").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
