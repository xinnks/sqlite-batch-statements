# SQLite-batch-statements

Benchmarking regular statements and batches in SQLite.

## Running benchmarks

> [!IMPORTANT]  
> To perform remote tests "_remote" for Rust and ":remote" for TS, make sure you
> rename the `.env.example` file to `.env` and populate it with the credentials
> of a Turso database.

### Using the rust SDK

```sh
cargo run --example <example-name> # e.g batch, batch_remote, stmt, stmt_remote
```

### Using the JS/TS SDK

Install npm dependencies by running:

```sh
npm install
```

Run individual tests:

```sh
npm run batch # batch, batch:remote, stmt, stmt:remote 
```

## Testing the constraints of interactive transactions

Run interactive transaction:

```sh
npm run antipat:interactive
```

Then, pass a value >10000 or time in miliseconds that's enough for you to run
the proceeding 👇 example.

While the above interactive transaction is ongoing, run the following command:

```sh
npm run antipat:regular
```
