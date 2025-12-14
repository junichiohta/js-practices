#!/usr/bin/env node

import { createDatabase } from "./db-helpers.js";

function runWithoutErrors(db) {
  return db
    .run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    )
    .then(() => {
      return db.run("INSERT INTO books (title) VALUES (?)", ["JavaScript入門"]);
    })
    .then((result) => {
      console.log("挿入されたID:", result.lastID);
      return db.get("SELECT * FROM books WHERE id = ?", [result.lastID]);
    })
    .then((book) => {
      console.log("取得したレコード:", book);
      return db.run("DROP TABLE books");
    });
}

function runWithErrors(db) {
  return db
    .run(
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    )
    .then(() => {
      return db.run("INSERT INTO books (title) VALUES (?)", ["TypeScript入門"]);
    })
    .then(() => {
      return db.run("INSERT INTO books (title) VALUES (?)", ["TypeScript入門"]);
    })
    .catch((err) => {
      console.error("UNIQUE制約違反:", err.message);
      return Promise.resolve();
    })
    .then(() => {
      return db.get("SELECT * FROM nonexistent_table WHERE id = ?", [1]);
    })
    .catch((err) => {
      console.error("レコード取得エラー:", err.message);
      return Promise.resolve();
    })
    .then(() => {
      return db.run("DROP TABLE books");
    })
    .then(() => {
      return db.close();
    });
}

const db = createDatabase();

runWithoutErrors(db)
  .then(() => {
    return new Promise((resolve) => setTimeout(resolve, 100));
  })
  .then(() => runWithErrors(db));
