#!/usr/bin/env node

import sqlite3 from "sqlite3";
const { Database } = sqlite3.verbose();

const db = new Database(":memory:");

function runWithoutErrors() {
  db.run(
    `
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE
    )
  `,
    (err) => {
      if (err) {
        console.error("テーブル作成エラー:", err.message);
        db.close();
        return;
      }

      db.run(
        `INSERT INTO books (title) VALUES (?)`,
        ["JavaScript入門"],
        function (err) {
          if (err) {
            console.error("データ挿入エラー:", err.message);
            db.close();
            return;
          }
          const insertedId = this.lastID;

          db.get(
            `SELECT * FROM books WHERE id = ?`,
            [insertedId],
            (err, book) => {
              if (err) {
                console.error("データ取得エラー:", err.message);
                db.close();
                return;
              }
              console.log("取得したレコード:", book);

              db.run(`DROP TABLE books`, (err) => {
                if (err) {
                  console.error("テーブル削除エラー:", err.message);
                  db.close();
                  return;
                }

                runWithErrors();
              });
            },
          );
        },
      );
    },
  );
}

function runWithErrors() {
  db.run(
    `
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE
    )
  `,
    (err) => {
      if (err) {
        console.error("テーブル作成エラー:", err.message);
        db.close();
        return;
      }

      db.run(
        `INSERT INTO books (title) VALUES (?)`,
        ["TypeScript入門"],
        (err) => {
          if (err) {
            console.error("データ挿入エラー:", err.message);
            db.close();
            return;
          }

          db.run(
            `INSERT INTO books (title) VALUES (?)`,
            ["TypeScript入門"],
            (err) => {
              if (err) {
                console.error("UNIQUE制約違反:", err.message);
              }

              db.get(`SELECT * FROM books WHERE id = ?`, [999], (err, book) => {
                if (err) {
                  console.error("データ取得エラー:", err.message);
                  db.close();
                  return;
                }
                if (!book) {
                  console.error("指定されたレコードが見つかりません");
                }

                db.run(`DROP TABLE books`, (err) => {
                  if (err) {
                    console.error("テーブル削除エラー:", err.message);
                  }
                  db.close();
                });
              });
            },
          );
        },
      );
    },
  );
}

runWithoutErrors();
