all: root program-inner drip-types-inner sdk-inner fetcher-inner test-inner format-inner

root:
	yarn

clean:
	yarn workspaces foreach run clean
	cd packages/sdk && yarn clean
	cd solana-programs && cargo clean

format: root format-inner

format-inner:
	cd solana-programs && cargo fmt
	yarn workspaces foreach run lint:fix

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
	cd packages/drip-types && yarn run anchor-client-gen ./drip_v2.json ./src --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"
	cd packages/drip-types && yarn install && yarn build

sdk-inner:
	cd packages/sdk && yarn install && yarn build

fetcher-inner:
	cd services/fetcher && yarn install && yarn build

test-inner:
	cd solana-programs && cargo test
	cd solana-programs && anchor test