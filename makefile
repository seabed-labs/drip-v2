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

fetcher: drip-types sdk anchor-client-gen
	cd services/fetcher && yarn install && yarn build && yarn lint:fix

sdk: program drip-types
	cd packages/sdk && yarn install && yarn build && yarn lint:fix

drip-types: root program anchor-client-gen
	cp solana-programs/target/types/drip_v2.ts packages/drip-types/src/drip_v2.ts 
	cd packages/drip-types && yarn install && yarn build && yarn lint:fix


anchor-client-gen: root program
	# tsoa can't use external types, but we want to directly pipe parsed accounts to api server
	yarn run anchor-client-gen ./solana-programs/idl/drip_v2.json ./services/fetcher/src/generated/anchor --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"
	yarn run anchor-client-gen ./solana-programs/idl/drip_v2.json ./packages/drip-types/src --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk" 