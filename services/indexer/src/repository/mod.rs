use dill::component;

pub trait Repository: Send + Sync {
    fn upsert_position(&self) -> Result<i32, ()>;
}

pub struct PostgresRepository {
    random: i32,
}

#[component(pub)]
impl PostgresRepository {
    pub fn new() -> Self {
        println!("Instantiating repository");
        PostgresRepository { random: 9 }
    }
}

impl Repository for PostgresRepository {
    fn upsert_position(&self) -> Result<i32, ()> {
        println!("Upserting positions");
        Ok(self.random)
    }
}
