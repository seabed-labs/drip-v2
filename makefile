all: root program-inner drip-types-inner sdk-inner fetcher-inner api-inner dripper-inner lint-fix-inner test-inner

root:
	yarn install
	cd ui/xnft && yarn install

clean: root
	yarn workspaces foreach run clean
	cd solana-programs && cargo clean

lint-fix: root lint-fix-inner

lint: root lint-inner

lint-fix-inner:
	yarn workspaces foreach run lint:fix
	cd solana-programs && cargo clippy --fix --allow-dirty -- -D warnings --A clippy::too_many_arguments --A clippy::borrowed_box -A clippy::result_large_err
	cd solana-programs && cargo fix --allow-dirty && cargo fmt

lint-inner:
	cd solana-programs && cargo clippy -- -D warnings --A clippy::too_many_arguments --A clippy::borrowed_box -A clippy::result_large_err
	cd solana-programs && cargo check
	yarn workspaces foreach run lint

test: program-inner drip-types-inner sdk-inner test-inner

fetcher: program-inner drip-types-inner sdk-inner fetcher-inner

api: program-inner drip-types-inner sdk-inner api-inner

dripper: program-inner drip-types-inner sdk-inner dripper-inner

sdk: program-inner drip-types-inner sdk-inner

drip-types: root program-inner drip-types-inner

program-inner:
	cd solana-programs && anchor build
	cp solana-programs/target/idl/drip_v2.json solana-programs/idl/drip_v2.json
	cp solana-programs/idl/drip_v2.json services/fetcher/drip_v2.json
	cp solana-programs/idl/drip_v2.json services/api/drip_v2.json
	cp solana-programs/target/types/drip_v2.ts packages/drip-types/src/drip_v2.ts
	cp solana-programs/idl/drip_v2.json packages/drip-types/drip_v2.json

drip-types-inner:
	cd packages/drip-types && yarn install && yarn build

sdk-inner:
	cd packages/sdk && yarn install && yarn build

fetcher-inner:
	cd services/fetcher && yarn install && yarn build

api-inner:
	cd services/api && yarn install && yarn build

dripper-inner:
	cd services/dripper && yarn install && yarn build

test-inner:
	cd solana-programs && cargo test
	cd solana-programs && anchor test

testd:
	cd solana-programs && anchor run testd
