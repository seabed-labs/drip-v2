mod models;
mod schema;

use crate::config::DatabaseConfig;
use crate::queue::models::{AccountQueueItem, TxQueueItem};
use async_trait::async_trait;
use deadpool_diesel::{Manager, Pool, Runtime};
use diesel::PgConnection;
use log::info;
use std::sync::Arc;

#[async_trait]
pub trait Queue<T>: Send + Sync {
    async fn pop(&self) -> Result<T, ()>;
    async fn re_queue(&self, item: T) -> Result<i32, ()>;
    async fn push(&self, item: T) -> Result<i32, ()>;
    async fn depth(&self) -> Result<i32, ()>;
}
pub trait TransactionQueue: Queue<TxQueueItem> {}

pub trait AccountQueue: Queue<AccountQueueItem> {}

pub struct TransactionQueueImpl {
    db_pool: Pool<Manager<PgConnection>>,
}

impl TransactionQueueImpl {
    pub async fn new(postgres_config: Arc<dyn DatabaseConfig>) -> Self {
        info!("Instantiating transaction queue");
        let manager = Manager::new(
            postgres_config.get_connection_url().as_str(),
            Runtime::Tokio1,
        );
        let db_pool = Pool::builder(manager)
            .max_size(postgres_config.get_connection_pool_size())
            .build()
            .expect("Failed to build db pool");
        TransactionQueueImpl { db_pool }
    }
}

#[async_trait]
impl Queue<TxQueueItem> for TransactionQueueImpl {
    async fn pop(&self) -> Result<TxQueueItem, ()> {
        todo!()
    }

    async fn re_queue(&self, item: TxQueueItem) -> Result<i32, ()> {
        todo!()
    }

    async fn push(&self, item: TxQueueItem) -> Result<i32, ()> {
        todo!()
    }

    async fn depth(&self) -> Result<i32, ()> {
        todo!()
    }
}

impl TransactionQueue for TransactionQueueImpl {}

pub struct AccountQueueImpl {
    db_pool: Pool<Manager<PgConnection>>,
}

impl AccountQueueImpl {
    pub async fn new(postgres_config: Arc<dyn DatabaseConfig>) -> Self {
        info!("Instantiating account queue");
        let manager = Manager::new(
            postgres_config.get_connection_url().as_str(),
            Runtime::Tokio1,
        );
        let db_pool = Pool::builder(manager)
            .max_size(postgres_config.get_connection_pool_size())
            .build()
            .expect("Failed to build db pool");
        AccountQueueImpl { db_pool }
    }
}

#[async_trait]
impl Queue<AccountQueueItem> for AccountQueueImpl {
    async fn pop(&self) -> Result<AccountQueueItem, ()> {
        todo!()
    }

    async fn re_queue(&self, item: AccountQueueItem) -> Result<i32, ()> {
        todo!()
    }

    async fn push(&self, item: AccountQueueItem) -> Result<i32, ()> {
        todo!()
    }

    async fn depth(&self) -> Result<i32, ()> {
        todo!()
    }
}

impl AccountQueue for AccountQueueImpl {}
