#!/usr/bin/env node

import { createDatabase } from "./db-helpers.js";

const db = createDatabase();

function runWithoutErrors() {
  return db
    .run(
      `
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE
      )
    `,
    )
    .then(() => {
      return db.run(`INSERT INTO books (title) VALUES (?)`, ["JavaScript入門"]);
    })
    .then((insertResult) => {
      return db.get(`SELECT * FROM books WHERE id = ?`, [insertResult.lastID]);
    })
    .then((book) => {
      console.log("取得したレコード:", book);
      return db.run(`DROP TABLE books`);
    });
}

function runWithErrors() {
  return db
    .run(
      `
      CREATE TABLE books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE
      )
    `,
    )
    .then(() => {
      return db.run(`INSERT INTO books (title) VALUES (?)`, ["TypeScript入門"]);
    })
    .then(() => {
      return db.run(`INSERT INTO books (title) VALUES (?)`, ["TypeScript入門"]);
    })
    .catch((err) => {
      console.error("UNIQUE制約違反:", err.message);
      return Promise.resolve();
    })
    .then(() => {
      return db.get(`SELECT * FROM books WHERE id = ?`, [999]);
    })
    .then((book) => {
      if (!book) {
        console.error("指定されたレコードが見つかりません");
      }
      return db.run(`DROP TABLE books`);
    })
    .then(() => {
      return db.close();
    });
}

runWithoutErrors()
  .then(() => runWithErrors())
  .catch((err) => {
    console.error("予期しないエラー:", err.message);
    process.exit(1);
  });
