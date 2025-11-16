#!/usr/bin/env node
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const now = new Date();
const year = argv.y ?? now.getFullYear();
const month = argv.m ?? now.getMonth() + 1;

console.log(`      ${month}月 ${year}        `);
console.log("日 月 火 水 木 金 土");

const firstDate = new Date(year, month - 1, 1);
const lastDate = new Date(year, month, 0);

let line = "";

for (let i = 0; i < firstDate.getDay(); i++) {
  line += "   ";
}

for (
  let date = new Date(firstDate);
  date <= lastDate;
  date.setDate(date.getDate() + 1)
) {
  const day = date.getDate();
  const isSaturday = date.getDay() === 6;
  const isLastDay = day === lastDate.getDate();

  line += `${String(day).padStart(2)}`;

  if (!isSaturday && !isLastDay) {
    line += " ";
  }

  if (isSaturday) {
    console.log(line);
    line = "";
  }
}

if (line) {
  console.log(line);
}
