mod queue;
mod repository;
mod workers;

use std::sync::Arc;
use crate::repository::{PostgresRepository, Repository};
use crate::workers::{AccountWorker, TransactionWorker, Worker};
use dotenvy::dotenv;
use log::{error, info};
use tokio::task::JoinSet;


#[tokio::main]
async fn main() {
    dotenv().ok();
    json_env_logger::init();
    json_env_logger::panic_hook();

    let repository: Arc<dyn Repository> = Arc::from(PostgresRepository::new());

    let account_worker: Box<dyn Worker> =  Box::from(AccountWorker::new(repository.clone()));
    let transaction_worker: Box<dyn Worker> =  Box::from(TransactionWorker::new(repository.clone()));

    let workers = Vec::from([account_worker, transaction_worker]);

    let mut work_set = JoinSet::new();
    for worker in workers {
        work_set.spawn(async move {
            worker.run()
        });
    }

    while let Some(res) = work_set.join_next().await {
        match res {
            Ok(indx) => info!("done thread {:?}", indx),
            Err(e) => error!("thread error: {:?}", e)
        }
    }
}
