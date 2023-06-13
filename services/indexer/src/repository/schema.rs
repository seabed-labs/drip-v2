// @generated automatically by Diesel CLI.

diesel::table! {
    schema_migrations (version) {
        version -> Int8,
        dirty -> Bool,
    }
}
