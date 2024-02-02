// USING PREPARED STATEMENTS

import Database from "libsql/promise";
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

async function createSchema(db) {
  await db.exec("create table if not exists todos (task varchar non null)");
  console.log("Created 'todos' table");
}

async function runQueries(size: number) {
  const dbNameString = shortNumber(size);
  const db = new Database(`dbs/test-p-${dbNameString}.db`, {});

  await createSchema(db);
  const limit = Array.from(Array(size).keys());

  const stmt = await db.prepare(`insert into todos values ("do task no. ?")`);

  const startTime = Date.now();
  for (const i of limit) {
    stmt.run(1);
  }
  console.log(`Added ${size} tasks in ${Date.now() - startTime}ms!`);

  const response = await db.prepare("select count(*) from todos");
  const results = response.get(1);

  console.log(`Items in db: `, JSON.stringify({ results }));

  process.exit();
}
