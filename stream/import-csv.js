import { parse } from "csv-parse";
import fs from "node:fs";

const filePath = "./tasks.csv";

const stream = fs.createReadStream(filePath);

const parser = parse({
  delimiter: ",",
  skipEmptyLines: true,
  fromLines: 2,
});

async function importCSV() {
  const linesParse = stream.pipe(parser);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  }
}

importCSV()
  .then(() => {
    console.log("Import CSV done!");
  })
  .catch((error) => {
    console.error("Error on import CSV", error);
  });
