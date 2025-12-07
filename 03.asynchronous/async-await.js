#!/usr/bin/env node

import { createDatabase } from "./db-helpers.js";

const db = createDatabase();

async function runWithoutErrors() {
  try {
    await db.run(`
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE
      )
    `);

    const insertResult = await db.run(`INSERT INTO books (title) VALUES (?)`, [
      "JavaScript入門",
    ]);

    const book = await db.get(`SELECT * FROM books WHERE id = ?`, [
      insertResult.lastID,
    ]);
    console.log("取得したレコード:", book);

    await db.run(`DROP TABLE books`);
  } catch (err) {
    console.error("エラー:", err.message);
    throw err;
  }
}

async function runWithErrors() {
  try {
    await db.run(`
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE
      )
    `);

    await db.run(`INSERT INTO books (title) VALUES (?)`, ["TypeScript入門"]);

    try {
      await db.run(`INSERT INTO books (title) VALUES (?)`, ["TypeScript入門"]);
    } catch (err) {
      console.error("UNIQUE制約違反:", err.message);
    }

    const book = await db.get(`SELECT * FROM books WHERE id = ?`, [999]);
    if (!book) {
      console.error("指定されたレコードが見つかりません");
    }

    await db.run(`DROP TABLE books`);
    await db.close();
  } catch (err) {
    console.error("予期しないエラー:", err.message);
    throw err;
  }
}

async function main() {
  try {
    await runWithoutErrors();
    await runWithErrors();
  } catch (err) {
    console.error("致命的なエラー:", err.message);
    process.exit(1);
  }
}

main();
