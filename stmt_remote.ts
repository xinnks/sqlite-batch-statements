// REGULAR LOOP THROUGH STATEMENTS

import dotenv from "dotenv";
import { type Client, createClient } from "@libsql/client";
import readline from "readline";
import { stdin as input, stdout as output } from "process";
dotenv.config();

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
  // console.log({
  //   url: process.env.TURSO_DATABASE_URL!,
  //   authToken: process.env.TURSO_AUTH_TOKEN!,
  // });
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  await createSchema(db);
  const limit = Array.from(Array(size).keys());
  console.log(`Inserting ${size} items to 'todos' table...`);
  const startTime = Date.now();
  for (let i of limit) {
    await db.execute({
      sql: "insert into todos values (?)",
      args: [`Do task no. ${i}`],
    });
  }
  console.log(`Added batch of ${size} tasks in ${Date.now() - startTime}ms!`);
  process.exit();
}
