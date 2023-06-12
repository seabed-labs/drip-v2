mod repository;
mod queue;
mod workers;

use shaku::{module, Component, Interface, HasComponent, HasProvider};
use std::sync::Arc;
use crate::repository::{PostgresRepository, Repository};
use crate::workers::{AccountWorker, TransactionWorker, Worker, AppWorkers};

trait Logger: Interface {
    fn log(&self, content: &str);
}

trait DateLogger: Interface {
    fn log_date(&self);
}

#[derive(Component)]
#[shaku(interface = Logger)]
struct LoggerImpl;

impl Logger for LoggerImpl {
    fn log(&self, content: &str) {
        println!("{}", content);
    }
}

#[derive(Component)]
#[shaku(interface = DateLogger)]
struct DateLoggerImpl {
    #[shaku(inject)]
    logger: Arc<dyn Logger>,
    today: String,
    year: usize,
}

impl DateLogger for DateLoggerImpl {
    fn log_date(&self) {
        self.logger.log(&format!("Today is {}, {}", self.today, self.year));
    }
}

module! {
    App {
        components = [],
        providers = [PostgresRepository, TransactionWorker]
    }
}

fn main() {
    let module = App::builder()
        // .with_component_parameters::<DateLoggerImpl>(DateLoggerImplParameters {
        //     today: "Jan 26".to_string(),
        //     year: 2020
        // })
        .build();

    let worker: Box<dyn Worker> = module.provide().unwrap();
    worker.run();
}