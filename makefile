all: root program-inner drip-types-inner sdk-inner components-inner api-inner dripper-inner mock-helius-inner lint-fix-inner test-inner

root:
	yarn install
	cd ui/xnft && yarn install
	cd services/mock-helius && yarn install

clean: root
	yarn workspaces foreach run clean
	cd solana-programs && cargo clean

lint-fix: root lint-fix-inner

lint: root lint-inner

lint-fix-inner:
	yarn workspaces foreach --parallel run lint:fix
	cd solana-programs && cargo clippy --fix --allow-dirty -- -D warnings --A clippy::too_many_arguments --A clippy::borrowed_box -A clippy::result_large_err
	cd solana-programs && cargo fix --allow-dirty && cargo fmt

lint-inner:
	cd solana-programs && cargo clippy -- -D warnings --A clippy::too_many_arguments --A clippy::borrowed_box -A clippy::result_large_err
	cd solana-programs && cargo check
	yarn workspaces foreach run lint

test: program-inner drip-types-inner sdk-inner test-inner

api: program-inner drip-types-inner sdk-inner api-inner

dripper: program-inner drip-types-inner sdk-inner dripper-inner

sdk: program-inner drip-types-inner sdk-inner

drip-types: root program-inner drip-types-inner

program-inner:
	cd solana-programs && yarn build

drip-types-inner:
	cd packages/drip-types && yarn install && yarn build

sdk-inner:
	cd packages/sdk && yarn install && yarn build

components-inner:
	cd packages/components && yarn install && yarn build

api-inner:
	cd services/api && yarn install && yarn build

dripper-inner:
	cd services/dripper && yarn install && yarn build

mock-helius-inner:
	# docker build -t mock-helius https://github.com/dcaf-labs/mock-helius.git#main
	cd services/dripper && yarn install && yarn build

test-inner:
	cd solana-programs && cargo test
	cd solana-programs && anchor test

testd:
	cd solana-programs && anchor run testd

# run-solana:
# 	cd solana-programs && yarn run localnet &
# 	sleep 10

# run-api:
# 	cd services/api && yarn run start:dev &

# run-mock-helius:
# 	docker run -d --name drip-v2-mock-helius --env-file ./services/mock-helius/.env mock-helius

# run-db:
# 	docker-compose --file ./docker-compose.yaml up -d