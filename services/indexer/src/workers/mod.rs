use crate::queue::{AccountQueue, Queue, TransactionQueue};
use crate::repository::Repository;
use log::info;
use std::sync::Arc;

pub trait Worker: Send + Sync {
    fn run(&self) -> Result<i32, String>;
}

pub struct AccountWorker {
    account_queue: Arc<dyn AccountQueue>,
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
    pub fn new(account_queue: Arc<dyn AccountQueue>, repository: Arc<dyn Repository>) -> Self {
        AccountWorker {
            account_queue,
            repository,
        }
    }
}

pub struct TransactionWorker {
    account_queue: Arc<dyn AccountQueue>,
    tx_queue: Arc<dyn TransactionQueue>,
    repository: Arc<dyn Repository>,
}

impl TransactionWorker {
    pub fn new(
        account_queue: Arc<dyn AccountQueue>,
        tx_queue: Arc<dyn TransactionQueue>,
        repository: Arc<dyn Repository>,
    ) -> Self {
        TransactionWorker {
            account_queue,
            tx_queue,
            repository,
        }
    }
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
