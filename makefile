# Default target
root:
	yarn

test: program sdk
	cd solana-programs && cargo test
	cd solana-programs && anchor test

clean:
	yarn workspaces run clean
	cd packages/sdk && yarn clean
	cd solana-programs && cargo clean

program: root
	cd solana-programs && anchor build
	cp solana-programs/target/idl/drip_v2.json solana-programs/idl/drip_v2.json

sdk: program generate-sdk-anchor-client
	cp solana-programs/target/types/drip_v2.ts packages/sdk/src/idl/drip_v2.ts
	yarn workspace @dcaf/drip install
	yarn workspace @dcaf/drip build

generate-sdk-anchor-client: program
	yarn run anchor-client-gen solana-programs/idl/drip_v2.json packages/sdk/src/generated --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"


