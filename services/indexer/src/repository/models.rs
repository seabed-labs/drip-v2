// Generated by diesel_ext

#![allow(unused)]
#![allow(clippy::all)]

use diesel::*;
use super::schema::*;

#[derive(Queryable, Debug, Identifiable)]
#[diesel(primary_key(version))]
pub struct SchemaMigration {
    pub version: i64,
    pub dirty: bool,
}

