use crate::repository::Repository;
use shaku::{Interface, Provider};

pub trait Workers: Interface {
    fn get(&self) -> Result<&[Box<dyn Worker>], ()>;
}

#[derive(Provider)]
#[shaku(interface = Workers)]
pub struct AppWorkers {
    #[shaku(provide)]
    workers: Box<[Box<dyn Worker>]>
}

impl Workers for AppWorkers {
    fn get(&self) -> Result<&[Box<dyn Worker>], ()> {
        Ok(self.workers.as_ref())
    }
}


pub trait Worker: Interface {
    fn run(&self) -> Result<i32, ()>;
}

#[derive(Provider)]
#[shaku(interface = Worker)]
pub struct AccountWorker {
    #[shaku(provide)]
    repository: Box<dyn Repository>,
}


impl Worker for AccountWorker {
    fn run(&self) -> Result<i32, ()> {
        loop {
            println!("Account worker")
        }
    }
}

#[derive(Provider)]
#[shaku(interface = Worker)]
pub struct TransactionWorker {
    #[shaku(provide)]
    repository: Box<dyn Repository>,
}


impl Worker for TransactionWorker {
    fn run(&self) -> Result<i32, ()> {
        loop {
            println!("Transaction Worker")
        }
    }
}