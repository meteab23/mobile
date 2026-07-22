import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_URL?.replace("file:", "") ?? path.join(dataDir, "app.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

export function initDb(): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL UNIQUE,
      added_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS signal_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      signal_type TEXT NOT NULL,
      price REAL NOT NULL,
      entry REAL,
      stop_loss REAL,
      take_profit_1 REAL,
      take_profit_2 REAL,
      confidence REAL,
      reason TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS analysis_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
}
