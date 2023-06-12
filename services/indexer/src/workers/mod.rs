use crate::repository::Repository;
use dill::component;
use std::sync::Arc;

pub trait Worker: Send + Sync {
    fn run(&self) -> Result<i32, ()>;
}

#[component]
pub struct AccountWorker {
    repository: Arc<dyn Repository>,
}

impl Worker for AccountWorker {
    fn run(&self) -> Result<i32, ()> {
        loop {
            println!("Account worker")
        }
    }
}

#[component]
pub struct TransactionWorker {
    repository: Arc<dyn Repository>,
}

impl Worker for TransactionWorker {
    fn run(&self) -> Result<i32, ()> {
        loop {
            println!("Transaction Worker");
            println!("{:?}", self.repository.upsert_position())
        }
    }
}
