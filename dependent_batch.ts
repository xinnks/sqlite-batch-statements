// DEPENDENT BATCH

// $ npm run pat:dep-batch

import { type Client, createClient } from "@libsql/client";
import readline from "readline";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({
  input,
  output,
});

console.log("How long should we wait? (milliseconds) ");
rl.on("line", async (val: any) => {
  await runQueries(Number(val));
});

async function createSchema(db: Client) {
  await db.execute(
    "create table if not exists users (id varchar non null, name varchar non null)"
  );
  console.log("Created users table");
  await db.execute(
    "create table if not exists tasks (title varchar non null, user_id varchar non null)"
  );
  console.log("Created todos table");
}

async function runQueries(timeout: number) {
  const db = createClient({
    url: `file:dbs/interactive.db`,
  });

  await createSchema(db);

  const startTime = Date.now();

  const id = Math.random() * 100 + 1;
  await db.execute({
    sql: "insert into users values (?, ?)",
    args: ["Bob", id],
  });

  console.log("Start performing an expensive job");
  await new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), timeout);
  });
  console.log("completed expensive job");

  await db.batch([
    {
      sql: "insert into tasks values (?, ?)",
      args: ["Go to the gym", id],
    },
    {
      sql: "insert into tasks values (?, ?)",
      args: ["Go buy some groceries", id],
    },
  ]);
  console.log(
    `Completed dependent batch that takes > ${timeout} milliseconds ${
      Date.now() - startTime
    }ms!`
  );
  process.exit();
}
