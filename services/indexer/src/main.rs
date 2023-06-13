mod queue;
mod repository;
mod workers;

use std::sync::Arc;
use crate::repository::{PostgresRepository, Repository};
use crate::workers::{AccountWorker, TransactionWorker, Worker};
use std::thread::spawn;
use dotenvy::dotenv;
use log::{error};


fn main() {
    dotenv().ok();
    json_env_logger::init();
    json_env_logger::panic_hook();

    let repository: Arc<dyn Repository> = Arc::from(PostgresRepository::new());
    let account_worker: Box<dyn Worker> =  Box::from(AccountWorker::new(repository.clone()));
    let transaction_worker: Box<dyn Worker> =  Box::from(TransactionWorker::new(repository.clone()));
    let workers = Vec::from([account_worker, transaction_worker]);
    let mut threads = Vec::new();
    for worker in workers {
        let thread = spawn(move || worker.run());
        threads.push(thread);
    }
    for thread in threads {
        if let Err(err) = thread.join().unwrap() {
            error!("Thread Error: {:?}", err);
        }
    }
}
