use std::env;

pub trait DatabaseConfig: Send + Sync {
    fn get_connection_url(&self) -> String;
    fn get_connection_pool_size(&self) -> usize;
}

pub struct IndexerConfig {
    connection_url: String,
}

impl IndexerConfig {
    pub fn new() -> Self {
        let connection_url =
            env::var("INDEXER_DB_CONNECTION_URL").expect("INDEXER_DB_CONNECTION_URL is not set");
        IndexerConfig { connection_url }
    }
}

impl DatabaseConfig for IndexerConfig {
    fn get_connection_url(&self) -> String {
        self.connection_url.clone()
    }
    fn get_connection_pool_size(&self) -> usize {
        10
    }
}

pub struct QueueConfig {
    connection_url: String,
}

impl QueueConfig {
    pub fn new() -> Self {
        let connection_url =
            env::var("QUEUE_DB_CONNECTION_URL").expect("QUEUE_DB_CONNECTION_URL is not set");
        QueueConfig { connection_url }
    }
}

impl DatabaseConfig for QueueConfig {
    fn get_connection_url(&self) -> String {
        self.connection_url.clone()
    }
    fn get_connection_pool_size(&self) -> usize {
        10
    }
}
