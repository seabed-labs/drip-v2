// @generated automatically by Diesel CLI.

diesel::table! {
    account_queue_items (public_key) {
        #[max_length = 255]
        public_key -> Varchar,
        priority -> Int4,
        attempts -> Int4,
        max_attempts -> Int4,
        time -> Timestamp,
        retry_time -> Nullable<Timestamp>,
    }
}

diesel::table! {
    schema_migrations (version) {
        version -> Int8,
        dirty -> Bool,
    }
}

diesel::table! {
    tx_queue_items (tx_signature) {
        #[max_length = 255]
        tx_signature -> Varchar,
        priority -> Int4,
        attempts -> Int4,
        max_attempts -> Int4,
        time -> Timestamp,
        retry_time -> Nullable<Timestamp>,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    account_queue_items,
    schema_migrations,
    tx_queue_items,
);
