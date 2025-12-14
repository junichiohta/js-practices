import fs from "fs";
import { Memo } from "./Memo.js";

export class MemoRepository {
  static JSON_INDENT_SPACES = 2;

  constructor(filePath = "memos.json") {
    this.filePath = filePath;
  }

  load() {
    try {
      const data = fs.readFileSync(this.filePath, "utf-8");
      const memos = JSON.parse(data);
      return memos.map((m) => new Memo(m.id, m.content));
    } catch {
      return [];
    }
  }

  save(memos) {
    const data = JSON.stringify(memos, null, MemoRepository.JSON_INDENT_SPACES);
    fs.writeFileSync(this.filePath, data, "utf-8");
  }

  add(content) {
    const memos = this.load();
    const id = memos.length > 0 ? Math.max(...memos.map((m) => m.id)) + 1 : 1;
    const memo = new Memo(id, content);
    memos.push(memo);
    this.save(memos);
    return memo;
  }

  list() {
    return this.load();
  }

  find(id) {
    const memos = this.load();
    return memos.find((m) => m.id === id);
  }

  delete(id) {
    const memos = this.load();
    const filtered = memos.filter((m) => m.id !== id);
    this.save(filtered);
  }
}
