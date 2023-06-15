mod config;
mod queue;
mod repository;
mod workers;

use crate::repository::{PostgresConfig, PostgresRepository, Repository, RepositoryConfig};
use crate::workers::{AccountWorker, TransactionWorker, Worker};
use dotenvy::dotenv;
use log::{error, info};
use std::sync::Arc;
use tokio::task::JoinSet;

#[tokio::main]
async fn main() {
    dotenv().ok();
    json_env_logger::init();
    json_env_logger::panic_hook();

    let repository_config: Arc<dyn RepositoryConfig> = Arc::from(PostgresConfig::new());
    let postgres_repository = Arc::from(PostgresRepository::new(repository_config).await);
    let account_worker: Box<dyn Worker> =
        Box::from(AccountWorker::new(postgres_repository.clone()));
    let transaction_worker: Box<dyn Worker> =
        Box::from(TransactionWorker::new(postgres_repository.clone()));

    let workers = Vec::from([account_worker, transaction_worker]);

    let mut work_set = JoinSet::new();
    for worker in workers {
        work_set.spawn(async move { worker.run() });
    }

    while let Some(res) = work_set.join_next().await {
        match res {
            Ok(indx) => info!("done thread {:?}", indx),
            Err(e) => error!("thread error: {:?}", e),
        }
    }
}
