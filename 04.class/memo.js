#!/usr/bin/env node

import { MemoApp } from "./lib/MemoApp.js";

const args = process.argv.slice(2);
const app = new MemoApp();

app.run(args).catch((err) => {
  console.error(err);
  process.exit(1);
});
