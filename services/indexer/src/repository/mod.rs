mod schema;
mod models;

use log::info;

pub trait Repository: Send + Sync {
    fn upsert_position(&self) -> Result<i32, ()>;
}

pub struct PostgresRepository {
}

impl PostgresRepository {
    pub fn new() -> Self {
        info!("Instantiating repository");
        PostgresRepository { }
    }
}

impl Repository for PostgresRepository {
    fn upsert_position(&self) -> Result<i32, ()> {
        info!("Upserting positions");
        Ok(1)
    }
}
