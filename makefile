all: root program-inner drip-types-inner sdk-inner fetcher-inner test-inner lint-fix-inner

root:
	yarn

clean:
	yarn workspaces foreach run clean
	cd packages/sdk && yarn clean
	cd solana-programs && cargo clean

lint-fix: root lint-fix-inner

lint: root lint-inner

lint-fix-inner:
	cd solana-programs && cargo fix --allow-dirty && cargo fmt
	yarn workspaces foreach run lint:fix

lint-inner:
	cd solana-programs && cargo check
	yarn workspaces foreach run lint

test: program-inner drip-types-inner sdk-inner test-inner

fetcher: program-inner drip-types-inner sdk-inner fetcher-inner

sdk: program-inner drip-types-inner sdk-inner

drip-types: root program-inner drip-types-inner

program-inner:
	cd solana-programs && anchor build
	cp solana-programs/target/idl/drip_v2.json solana-programs/idl/drip_v2.json
	cp solana-programs/idl/drip_v2.json services/fetcher/drip_v2.json
	cp solana-programs/target/types/drip_v2.ts packages/drip-types/src/drip_v2.ts
	cp solana-programs/idl/drip_v2.json packages/drip-types/drip_v2.json

drip-types-inner:
	cd packages/drip-types && yarn install && yarn build

sdk-inner:
	cd packages/sdk && yarn install && yarn build

fetcher-inner:
	cd services/fetcher && yarn install && yarn build

test-inner:
	cd solana-programs && cargo test
	cd solana-programs && anchor test