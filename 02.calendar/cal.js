#!/usr/bin/env node
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const now = new Date();
const year = argv.y || now.getFullYear();
const month = argv.m || now.getMonth() + 1;

const monthName = `      ${month}月 ${year}        `;
const dayHeaders = "日 月 火 水 木 金 土  ";

const firstDay = new Date(year, month - 1, 1);
const lastDay = new Date(year, month, 0);

console.log(monthName);
console.log(dayHeaders);


const startDayOfWeek = firstDay.getDay();
let line = "";
for (let i = 0; i < startDayOfWeek; i++) {
  line += "   ";
}

for (let day = 1; day <= lastDay.getDate(); day++) {
  line += day.toString().padStart(2) + " ";

  const currentDayOfWeek = new Date(year, month - 1, day).getDay();
  if (currentDayOfWeek === 6) {
    console.log(line + " ");
    line = "";
  }
}

if (line.trim()) {
  console.log(line);
}
