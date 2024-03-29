// REGULAR LOOP THROUGH STATEMENTS

// $ npm run stmt

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
    url: `file:dbs/test-s-${dbNameString}.db`,
  });

  await createSchema(db);
  const limit = Array.from(Array(size).keys());
  console.log(`Inserting ${size} items to 'todos' table...`);
  const startTime = Date.now();
  for (let i of limit) {
    await db.execute({
      sql: 'insert into todos values ("do task no. ?")',
      args: [i],
    });
  }
  console.log(`Added batch of ${size} tasks in ${Date.now() - startTime}ms!`);

  const { rows } = await db.execute("select count(*) from todos");

  console.log(`Items in db: `, JSON.stringify({ rows }));
  process.exit();
}
