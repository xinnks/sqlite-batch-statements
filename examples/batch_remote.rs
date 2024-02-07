// USING BATCH STATEMENTS ON REMOTE DATABASE

use libsql::Database;
use std::{io, time::Instant};

use dotenv::dotenv;
use tokio;

extern crate number_shortener;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let mut q_size = String::new();

    println!("How many queries do you want to run? ");

    io::stdin()
        .read_line(&mut q_size)
        .expect("Failed to read value");

    let q_size: u32 = match q_size.trim().parse() {
        Ok(num) => num,
        Err(_) => 1,
    };

    let db_url = std::env::var("TURSO_DATABASE_URL").expect("TURSO_DATABASE_URL not found!");
    let auth_token = std::env::var("TURSO_AUTH_TOKEN").expect("TURSO_AUTH_TOKEN not found!");

    let db = Database::open_remote(db_url, auth_token).unwrap();

    let conn = db.connect().unwrap();
    conn.execute(
        "create table if not exists todos (task varchar non null)",
        (),
    )
    .await
    .unwrap();

    let mut stmts = vec![];
    stmts.push("begin".to_string());
    for i in 1..(q_size + 1) {
        let curr_stmt = format!("insert into todos values (\"do task no. {i}\")");
        stmts.push(curr_stmt.to_string());
    }
    stmts.push("end;".to_string());

    let stmts = stmts.join(";\n");
    // println!("all statements are {}", stmts.as_str());

    let start = Instant::now();
    let _result = conn.execute_batch(&stmts).await;
    // println!("Added count: {:?}", _result);

    let duration = start.elapsed();
    println!("Added {:?} rows to table in {:?}", q_size, duration);
}
