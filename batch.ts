// USING BATCH STATEMENTS

// $ npm run batch

import { type Client, createClient } from "@libsql/client";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
import shortNumber from "short-number";

const rl = readline.createInterface({
  input,
  output,
});

console.log("How many queries do you want to run? ");
rl.on("line", async (val: any) => {
  await runQueries(Number(val));
});

async function createSchema(db: Client) {
  await db.execute("create table if not exists todos (task varchar non null)");
  console.log("Created 'todos' table");
}

async function runQueries(size: number) {
  const dbNameString = shortNumber(size);
  const db = createClient({
    url: `file:dbs/test-b-${dbNameString}.db`,
  });

  await createSchema(db);
  const limit = Array.from(Array(size).keys());
  console.log(`Inserting ${size} items to 'todos' table...`);
  const statements = limit.map(
    (i) => `insert into todos values ('do task no. ${i}')`
  );
  const startTime = Date.now();
  await db.batch(statements, "write");
  console.log(`Added batch of ${size} tasks in ${Date.now() - startTime}ms!`);
  process.exit();
}
