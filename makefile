test: program sdk
	yarn install --force
	cargo test
	anchor test

program:
	anchor build
	cp target/idl/drip_v2.json ./idl/drip_v2.json

sdk: program generate-sdk-anchor-client
	cd sdk && yarn install
	cd sdk && yarn build


clean:
	rm -rf target
	cd sdk && yarn clean

generate-sdk-anchor-client: program
	PROGRAM_ID=$(solana-keygen pubkey ./drip-keypair.json)
	yarn run anchor-client-gen idl/drip_v2.json ./sdk/src/generated --program-id "74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"

generate-backend-anchor-client: program

backend: generate-backend
