mod queue;
mod repository;
mod workers;

use crate::repository::{PostgresRepository, Repository};
use crate::workers::{AccountWorker, TransactionWorker, Worker};
use dill::{AllOf, CatalogBuilder};
use std::thread::spawn;

fn main() {
    let catalog = CatalogBuilder::new()
        .add::<TransactionWorker>()
        .bind::<dyn Worker, TransactionWorker>()
        .add::<AccountWorker>()
        .bind::<dyn Worker, AccountWorker>()
        .add::<PostgresRepository>()
        .bind::<dyn Repository, PostgresRepository>()
        .build();
    let workers = catalog.get::<AllOf<dyn Worker>>().unwrap();
    let mut threads = Vec::new();
    for worker in workers {
        let thread = spawn(move || worker.run());
        threads.push(thread);
    }
    for thread in threads {
        if let Err(err) = thread.join().unwrap() {
            eprintln!("Thread Error: {:?}", err);
        }
    }
}
