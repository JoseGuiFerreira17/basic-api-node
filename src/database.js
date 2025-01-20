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

  insert(table, data) {
    if (Array.isArray(this.#dabatabase[table])) {
      this.#dabatabase[table].push(data);
    } else {
      this.#dabatabase[table] = [data];
    }
    this.#persist();
    return data;
  }

  select(table) {
    return this.#dabatabase[table] ?? [];
  }

  delete(table, id) {
    const rowIndex = this.#dabatabase[table].findIndex((row) => row.id === id);
    if (rowIndex > -1) {
      this.#dabatabase[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
