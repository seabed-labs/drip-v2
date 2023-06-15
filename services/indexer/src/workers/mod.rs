use crate::repository::Repository;
use log::info;
use std::sync::Arc;

pub trait Worker: Send + Sync {
    fn run(&self) -> Result<i32, String>;
}

pub struct AccountWorker {
    repository: Arc<dyn Repository>,
}

impl Worker for AccountWorker {
    fn run(&self) -> Result<i32, String> {
        let mut i = 0;
        loop {
            i += 1;
            info!("Account worker");
            if i == 15 {
                return Err(String::from("account worker error"));
            }
        }
    }
}

impl AccountWorker {
    pub fn new(repository: Arc<dyn Repository>) -> Self {
        AccountWorker { repository }
    }
}

pub struct TransactionWorker {
    repository: Arc<dyn Repository>,
}

impl Worker for TransactionWorker {
    fn run(&self) -> Result<i32, String> {
        let mut i = 0;
        loop {
            i += 1;
            info!("Transaction Worker");
            if i == 10 {
                return Err(String::from("transaction worker error"));
            }
        }
    }
}

impl TransactionWorker {
    pub fn new(repository: Arc<dyn Repository>) -> Self {
        TransactionWorker { repository }
    }
}
