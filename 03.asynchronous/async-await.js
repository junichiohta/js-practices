#!/usr/bin/env node

import { createDatabase } from "./db-helpers.js";

async function runWithoutErrors(db) {
  await db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  const result = await db.run("INSERT INTO books (title) VALUES (?)", [
    "JavaScript入門",
  ]);
  console.log("挿入されたID:", result.lastID);
  const book = await db.get("SELECT * FROM books WHERE id = ?", [
    result.lastID,
  ]);
  console.log("取得したレコード:", book);
  await db.run("DROP TABLE books");
}

async function runWithErrors(db) {
  await db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  await db.run("INSERT INTO books (title) VALUES (?)", ["TypeScript入門"]);

  try {
    await db.run("INSERT INTO books (title) VALUES (?)", ["TypeScript入門"]);
  } catch (err) {
    console.error("UNIQUE制約違反:", err.message);
  }

  try {
    await db.get("SELECT * FROM nonexistent_table WHERE id = ?", [1]);
  } catch (err) {
    console.error("レコード取得エラー:", err.message);
  }

  await db.run("DROP TABLE books");
  await db.close();
}

async function main() {
  const db = createDatabase();
  await runWithoutErrors(db);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await runWithErrors(db);
}

main();
