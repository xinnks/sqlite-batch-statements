// USING BATCH STATEMENTS

// $ cargo run --example batch

use libsql::Database;
use std::{io, time::Instant};

use tokio;

extern crate number_shortener;
use number_shortener::shorten_number;

#[tokio::main]
async fn main() {
    let mut q_size = String::new();

    println!("How many queries do you want to run? ");

    io::stdin()
        .read_line(&mut q_size)
        .expect("Failed to read value");

    let q_size: u32 = match q_size.trim().parse() {
        Ok(num) => num,
        Err(_) => 1,
    };

    let q_short = shorten_number(q_size as f32).to_string();

    let db_name = format!("dbs/test-b-rs-{q_short}.db");
    let db = Database::open(db_name).unwrap();

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

    let stmts = stmts.join(";");
    // println!("all statements are {}", stmts.as_str());

    let start = Instant::now();
    let _result = conn.execute_batch(&stmts).await;
    // println!("Added count: {:?}", _result);

    let duration = start.elapsed();
    println!("Added {:?} rows to table in {:?}", q_size, duration);

    let mut count_stmt = conn.prepare("select count(*) from todos").await.unwrap();
    let mut result = count_stmt.query([""]).await.unwrap();
    let rows = result.next().unwrap().unwrap();
    println!("Added count: {:?}", rows.get_value(0))
}
