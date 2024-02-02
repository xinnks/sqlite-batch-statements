// REGULAR LOOP THROUGH STATEMENTS

use libsql::{params, Database};
use std::{io, time::Instant};

use tokio;

extern crate number_shortener;

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

    let db_url = "..."; // TODO: Use libSQL database URL
    let auth_token = "..."; // TODO: Use libSQL database authentication token

    let db = Database::open_remote(db_url, auth_token).unwrap();

    let conn = db.connect().unwrap();
    conn.execute(
        "create table if not exists todos (task varchar non null)",
        (),
    )
    .await
    .unwrap();

    let start = Instant::now();
    for i in 1..(q_size + 1) {
        let _ = conn
            .execute(
                "insert into todos values (?1)",
                params![format!("do task no. {i}")],
            )
            .await;
    }
    let duration = start.elapsed();
    println!("Added {:?} rows to table in {:?}", q_size, duration);
}
