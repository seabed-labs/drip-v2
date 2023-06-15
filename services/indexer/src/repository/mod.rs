mod models;
mod schema;

use async_trait::async_trait;
use deadpool_diesel::{Manager, Pool, Runtime};
use diesel::pg::PgConnection;
use log::info;
use std::env;
use std::sync::Arc;

pub trait RepositoryConfig: Send + Sync {
    fn get_connection_url(&self) -> String;
    fn get_pool_size(&self) -> usize;
}

pub struct PostgresConfig {
    connection_url: String,
}

impl RepositoryConfig for PostgresConfig {
    fn get_connection_url(&self) -> String {
        self.connection_url.clone()
    }
    fn get_pool_size(&self) -> usize {
        10
    }
}

impl PostgresConfig {
    pub fn new() -> Self {
        let connection_url =
            env::var("INDEXER_DB_CONNECTION_URL").expect("INDEXER_DB_CONNECTION_URL is not set");
        PostgresConfig { connection_url }
    }
}

#[async_trait]
pub trait Repository: Send + Sync {
    async fn upsert_position(&self) -> Result<i32, ()>;
}

pub struct PostgresRepository {
    db_pool: Pool<Manager<PgConnection>>,
}

impl PostgresRepository {
    pub async fn new(postgres_config: Arc<dyn RepositoryConfig>) -> Self {
        info!("Instantiating repository");
        let manager = Manager::new(
            postgres_config.get_connection_url().as_str(),
            Runtime::Tokio1,
        );
        let db_pool = Pool::builder(manager)
            .max_size(postgres_config.get_pool_size())
            .build()
            .expect("Failed to build db pool");
        PostgresRepository { db_pool }
    }
}

#[async_trait]
impl Repository for PostgresRepository {
    async fn upsert_position(&self) -> Result<i32, ()> {
        let _ = self
            .db_pool
            .get()
            .await
            .expect("Failed to get db connection");
        info!("Upserting positions");
        Ok(1)
    }
}
