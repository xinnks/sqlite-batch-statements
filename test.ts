import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:test-test.db",
});

async function createSchema() {
  await db.execute("create table if not exists todos (task varchar non null)");
}

(async function () {
  await createSchema();
  const limit = Array.from(Array(3).keys());
  const startTime = Date.now();
  for (const i of limit) {
    await db.execute({
      sql: 'insert into todos values ("do task no. ?")',
      args: [i],
    });
    if (i === limit.length - 1) {
      console.log(
        `Added ${limit.length} tasks in ${Date.now() - startTime}ms!`
      );
    }
  }

  const stmts = limit.map((i) => ({
    sql: "insert into todos values ('do task no ?')",
    args: [i * 33],
  }));
  console.log({ stmts });
  const response = await db.batch(stmts, "write");
  console.log({ res: JSON.stringify({ response }) });
})();

/**
 * {
 * 100 -> 117ms
 * 1000 -> 646ms
 * 10000 -> 6463ms
 * 100000 -> 66024ms
 * 1000000 -> 811482ms
 * 10000000 ->
 * }
 */
