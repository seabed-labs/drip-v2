use std::error::Error;
use shaku::{Interface, Component, Provider, HasComponent, Module};

pub trait Repository: Interface {
    fn upsert_position(&self) -> Result<i32, ()>;
}

#[derive(Provider)]
#[shaku(interface = Repository)]
pub struct PostgresRepository {

}
//
// impl<M: Module + HasComponent<dyn Repository>> Provider<M> for PostgresRepository {
//     type Interface = PostgresRepository;
//
//     fn provide(module: &M) -> Result<Box<PostgresRepository>, Box<dyn Error + 'static>> {
//         // let pool: &dyn ConnectionPool = module.resolve_ref();
//         Ok(Box::new(PostgresRepository{}))
//     }
// }

impl Repository for PostgresRepository {
    fn upsert_position(&self) -> Result<i32, ()> {
        println!("Upserting positions");
        Ok(1)
    }
}