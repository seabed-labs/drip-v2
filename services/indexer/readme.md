## Getting Starting
```bash
# macos specific 
# https://github.com/sgrif/pq-sys/issues/35
brew install postgresql


cargo install diesel_cli --no-default-features --features "postgres"
cargo install diesel_cli_ext
```

To generate files
```bash
# from monorepo root
make generate-indexer-database-models
```

## TODO
- should gitignore generated files
- should streamline model generation
- need to finalize backend development flow given two backend stacks