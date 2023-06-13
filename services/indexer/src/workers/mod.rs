use std::sync::Arc;
use log::info;
use crate::repository::Repository;

pub trait Worker: Send + Sync {
    fn run(&self) -> Result<i32, ()>;
}

pub struct AccountWorker {
    repository:  Arc<dyn Repository>,
}

impl Worker for AccountWorker {
    fn run(&self) -> Result<i32, ()> {
        loop {
            info!("Account worker")
        }
    }
}

impl AccountWorker {
    pub fn new(repository: Arc<dyn Repository>) -> Self {
        AccountWorker{ repository }
    }
}

pub struct TransactionWorker {
    repository:  Arc<dyn Repository>,
}

impl Worker for TransactionWorker {
    fn run(&self) -> Result<i32, ()> {
        loop {
            info!("Transaction Worker");
        }
    }
}

impl TransactionWorker {
    pub fn new(repository: Arc<dyn Repository>) -> Self {
        TransactionWorker{ repository }
    }
}
