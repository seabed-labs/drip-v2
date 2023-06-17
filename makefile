# Default target
test: program sdk
	yarn install --force
	cargo test -p drip-v2
	anchor test

clean:
	rm -rf target
	cd sdk && yarn clean
	cargo clean

program:
# program needs sdk/dist to exist or else we can't yarn...
	cd sdk && yarn && yarn build
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


