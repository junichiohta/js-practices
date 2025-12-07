import { MemoRepository } from "./MemoRepository.js";
import enquirer from "enquirer";
import readline from "readline";

export class MemoApp {
  constructor() {
    this.repository = new MemoRepository();
  }

  async run(args) {
    const option = args[0];

    if (!option) {
      await this.add();
    } else if (option === "-l") {
      this.list();
    } else if (option === "-r") {
      await this.read();
    } else if (option === "-d") {
      await this.delete();
    } else {
      console.error("Invalid option");
      process.exit(1);
    }
  }

  async add() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let content = "";
    rl.on("line", (line) => {
      content += line + "\n";
    });

    rl.on("close", () => {
      if (content.trim()) {
        this.repository.add(content.trim());
      }
    });
  }

  list() {
    const memos = this.repository.list();
    memos.forEach((memo) => {
      console.log(memo.getFirstLine());
    });
  }

  async read() {
    const memos = this.repository.list();
    if (memos.length === 0) {
      console.log("No memos found");
      return;
    }

    const choices = memos.map((memo) => ({
      name: memo.id,
      message: memo.getFirstLine(),
    }));

    const response = await enquirer.prompt({
      type: "select",
      name: "memoId",
      message: "Choose a note you want to see:",
      choices,
    });

    const memo = this.repository.find(response.memoId);
    console.log("\n" + memo.content);
  }

  async delete() {
    const memos = this.repository.list();
    if (memos.length === 0) {
      console.log("No memos found");
      return;
    }

    const choices = memos.map((memo) => ({
      name: memo.id,
      message: memo.getFirstLine(),
    }));

    const response = await enquirer.prompt({
      type: "select",
      name: "memoId",
      message: "Choose a memo you want to delete:",
      choices,
    });

    this.repository.delete(response.memoId);
  }
}
