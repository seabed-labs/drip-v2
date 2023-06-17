# Default target
test: program sdk
	yarn install --force
	cd solana-programs && cargo test
	cd solana-programs && anchor test

clean:
	rm -rf target
	cd packages/sdk && yarn clean
	cargo clean

program:
# program needs sdk/dist to exist or else we can't yarn...
	cd packages/sdk && yarn && yarn build
	cd solana-programs && yarn && anchor build
	cp solana-programs/target/idl/drip_v2.json solana-programs/idl/drip_v2.json
	cp solana-programs/target/types/drip_v2.ts packages/sdk/src/idl/drip_v2.ts

#############################################################################
# Frontend
#############################################################################

sdk: program generate-sdk-anchor-client
	cd packages/sdk && yarn install
	cd packages/sdk && yarn build

generate-sdk-anchor-client: program
	yarn run anchor-client-gen solana-programs/idl/drip_v2.json packages/sdk/src/generated --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"

#############################################################################
# Services
#############################################################################


