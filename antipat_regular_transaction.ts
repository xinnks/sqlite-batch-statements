// REGULAR TRANSACTION

// $ npm run antipat:regular

import { type Client, createClient } from "@libsql/client";
import readline from "readline";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({
  input,
  output,
});

console.log("How long should we wait? (milliseconds) ");
(async () => {
  await runQueries();
})();

async function createSchema(db: Client) {
  await db.execute("create table if not exists todos (task varchar non null)");
  console.log("Created users todos");
}

async function runQueries() {
  const db = createClient({
    url: `file:dbs/interactive.db`,
  });

  await createSchema(db);
  console.log(`Inserting 1 items to 'todos' table...`);
  const startTime = Date.now();
  await db.execute({
    sql: 'insert into todos values ("do task no. ?")',
    args: [1],
  });
  console.log(
    `Added 1 task in ${
      Date.now() - startTime
    }ms while a parallel high-latency transaction was running!`
  );

  const { rows } = await db.execute("select count(*) from todos");

  console.log(`Items in db: `, JSON.stringify({ rows }));
  process.exit();
}
