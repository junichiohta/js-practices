export class Memo {
  constructor(id, content) {
    this.id = id;
    this.content = content;
  }

  getFirstLine() {
    return this.content.split("\n")[0];
  }
}
