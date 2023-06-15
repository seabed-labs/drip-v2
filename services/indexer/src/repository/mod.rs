mod models;
mod schema;

use crate::config::DatabaseConfig;
use async_trait::async_trait;
use deadpool_diesel::{Manager, Pool, Runtime};
use diesel::pg::PgConnection;
use log::info;
use std::sync::Arc;

#[async_trait]
pub trait Repository: Send + Sync {
    async fn upsert_position(&self) -> Result<i32, ()>;
}

pub struct PostgresRepositoryImpl {
    db_pool: Pool<Manager<PgConnection>>,
}

impl PostgresRepositoryImpl {
    pub async fn new(postgres_config: Arc<dyn DatabaseConfig>) -> Self {
        info!("Instantiating repository");
        let manager = Manager::new(
            postgres_config.get_connection_url().as_str(),
            Runtime::Tokio1,
        );
        let db_pool = Pool::builder(manager)
            .max_size(postgres_config.get_connection_pool_size())
            .build()
            .expect("Failed to build db pool");
        PostgresRepositoryImpl { db_pool }
    }
}

#[async_trait]
impl Repository for PostgresRepositoryImpl {
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
