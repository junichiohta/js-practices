#!/usr/bin/env node

import sqlite3 from "sqlite3";

function runWithoutErrors(db) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run(
        "INSERT INTO books (title) VALUES (?)",
        ["JavaScript入門"],
        function () {
          console.log("挿入されたID:", this.lastID);
          db.get(
            "SELECT * FROM books WHERE id = ?",
            [this.lastID],
            (err, book) => {
              console.log("取得したレコード:", book);
              db.run("DROP TABLE books", () => {
                setTimeout(() => runWithErrors(db), 100);
              });
            },
          );
        },
      );
    },
  );
}

function runWithErrors(db) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books (title) VALUES (?)", ["TypeScript入門"], () => {
        db.run(
          "INSERT INTO books (title) VALUES (?)",
          ["TypeScript入門"],
          (err) => {
            if (err) {
              console.error("UNIQUE制約違反:", err.message);
            }
            db.get(
              "SELECT * FROM nonexistent_table WHERE id = ?",
              [1],
              (err) => {
                if (err) {
                  console.error("レコード取得エラー:", err.message);
                }
                db.run("DROP TABLE books", () => {
                  db.close();
                });
              },
            );
          },
        );
      });
    },
  );
}

const db = new sqlite3.Database(":memory:");
runWithoutErrors(db);
