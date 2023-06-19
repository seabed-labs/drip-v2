# Default target
root:
	yarn

format:
	cd solana-programs && cargo fmt
	yarn
	yarn workspaces run lint:fix
	
test: program sdk
	cd solana-programs && cargo test
	cd solana-programs && anchor test

clean:
	yarn workspaces run clean
	cd packages/sdk && yarn clean
	cd solana-programs && cargo clean

program:
	cd solana-programs && anchor build
	cp solana-programs/target/idl/drip_v2.json solana-programs/idl/drip_v2.json

fetcher: drip-types sdk
	cd services/fetcher && yarn install && yarn build

sdk: program drip-types
	cd packages/sdk && yarn install && yarn build

drip-types: root program
	cp solana-programs/target/types/drip_v2.ts packages/drip-types/src/drip_v2.ts
	cd packages/drip-types && yarn run anchor-client-gen ../../solana-programs/idl/drip_v2.json ./src --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk" 
	cd packages/drip-types && yarn install && yarn build
	cd packages/drip-types && yarn lint:fix


