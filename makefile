# Default target
test: program sdk
	yarn install --force
	cargo test -p drip-v2
	anchor test

clean:
	rm -rf target
	cd sdk && yarn clean

program:
	yarn
	anchor build
	cp target/idl/drip_v2.json ./idl/drip_v2.json

#############################################################################
# Frontend
#############################################################################

sdk: program generate-sdk-anchor-client
	cd sdk && yarn install
	cd sdk && yarn build

generate-sdk-anchor-client: program
	yarn run anchor-client-gen idl/drip_v2.json ./sdk/src/generated --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"

#############################################################################
# Services
#############################################################################

backend: indexer

indexer: program generate-indexer-database-models
	cargo build -p indexer

# TODO(Mocha/Breve): This can be streamlined to be done in a docker container or something
generate-indexer-database-models:
	DATABASE_URL=postgres://dcaf:dcaf@localhost/indexer diesel print-schema > services/indexer/src/repository/schema.rs
	DATABASE_URL=postgres://dcaf:dcaf@localhost/queue diesel print-schema > services/indexer/src/queue/schema.rs
	DATABASE_URL=postgres://dcaf:dcaf@localhost/indexer diesel_ext --import-types "diesel::*" --import-types "super::schema::*" --schema-file services/indexer/src/repository/schema.rs --model > services/indexer/src/repository/models.rs
	DATABASE_URL=postgres://dcaf:dcaf@localhost/queue diesel_ext --import-types "diesel::*" --import-types "super::schema::*" --schema-file services/indexer/src/queue/schema.rs --model > services/indexer/src/queue/models.rs
