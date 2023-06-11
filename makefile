test: program sdk
	yarn install --force
	cargo test
	anchor test

program:
	anchor build
	cp target/idl/drip_v2.json ./idl/drip_v2.json

sdk: program
	cd sdk && yarn install
	cd sdk && yarn build


clean:
	rm -rf target
	cd sdk && yarn clean
