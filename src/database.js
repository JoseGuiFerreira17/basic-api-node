import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #dabatabase = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#dabatabase = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#dabatabase));
  }
}
