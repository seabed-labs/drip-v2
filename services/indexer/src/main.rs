mod config;
mod queue;
mod repository;
mod workers;

use crate::config::{IndexerConfig, QueueConfig};
use crate::queue::{AccountQueue, AccountQueueImpl, TransactionQueue, TransactionQueueImpl};
use crate::repository::{PostgresRepositoryImpl, Repository};
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

    let indexer_config = Arc::from(IndexerConfig::new());
    let indexer_repository = Arc::from(PostgresRepositoryImpl::new(indexer_config).await);

    let queue_config = Arc::from(QueueConfig::new());
    let account_queue: Arc<dyn AccountQueue> =
        Arc::from(AccountQueueImpl::new(queue_config.clone()).await);
    let tx_queue: Arc<dyn TransactionQueue> =
        Arc::from(TransactionQueueImpl::new(queue_config).await);

    let account_worker: Box<dyn Worker> = Box::from(AccountWorker::new(
        account_queue.clone(),
        indexer_repository.clone(),
    ));
    let transaction_worker: Box<dyn Worker> = Box::from(TransactionWorker::new(
        account_queue,
        tx_queue,
        indexer_repository,
    ));

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
