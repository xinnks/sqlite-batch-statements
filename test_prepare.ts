// USING PREPARED STATEMENTS

import Database from "libsql";
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
  const db = new Database(`dbs/test-p-${dbNameString}.db`);

  await createSchema(db);
  const limit = Array.from(Array(size).keys());

  const stmt = (i: any) =>
    db.prepare(`insert into todos values ("do task no. ${i}")`);

  const startTime = Date.now();
  for (const i of limit) {
    stmt(i).run();
  }
  console.log(`Added ${size} tasks in ${Date.now() - startTime}ms!`);

  const results = db.prepare("select count(*) from todos").get();

  console.log(`Items in db: `, JSON.stringify({ results }));

  process.exit();
}
/**
 * {
 * 100 ->
 * 1000 -> 635ms
 * 10000 -> 6137ms
 * 100000 -> 63816ms
 * 1000000 -> 686655ms!
 * 10000000 ->
 * 100000000 ->
 * }
 */
