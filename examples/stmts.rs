// REGULAR LOOP THROUGH STATEMENTS

// $ cargo run --example stmts

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

    let start = Instant::now();
    for i in 1..(q_size + 1) {
        let _response = conn.query("INSERT INTO todos (task) VALUES (?)", [i]).await;
    }
    let duration = start.elapsed();
    println!("Added {:?} rows to table in {:?}", q_size, duration);

    let mut count_stmt = conn.prepare("select count(*) from todos").await.unwrap();
    let mut result = count_stmt.query([""]).await.unwrap();
    let rows = result.next().unwrap().unwrap();
    println!("Added count: {:?}", rows.get_value(0))
}
