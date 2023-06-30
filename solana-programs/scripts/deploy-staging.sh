solana config set -u "https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d"

CODE_DEFINED_PROGRAM_ID="74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"
PROGRAM_ID=$(solana-keygen pubkey ./drip_v2-keypair.json)
UPGRADE_AUTH=$(solana-keygen pubkey ./upgrade-authority.json)
echo "Program ID"
echo $PROGRAM_ID
echo "Upgrade Authority"
echo $UPGRADE_AUTH

solana balance $UPGRADE_AUTH

# Replace Program ID 
find . -name '*.toml' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;
find . -name '*.rs' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;
find . -name '*.ts' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;
find . -name '*.json' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;

rm -rf ./**/*.rs-e
rm -rf ./**/*.toml-e
rm -rf ./**/*.ts-e
rm -rf ./**/*.json-e
rm -rf ./target

# verifiable doesn't work for Mocha
# anchor build --verifiable
anchor build
cp ./drip_v2-keypair.json ./target/deploy/drip_v2-keypair.json 

echo "Program ID"
echo $PROGRAM_ID
echo "Upgrade Authority"
echo $UPGRADE_AUTH

# --provider.cluster https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d 
# anchor upgrade --program-id ${PROGRAM_ID} --provider.cluster https://api.devnet.solana.com --provider.wallet ./upgrade-authority.json ./target/deploy/drip.so
# anchor idl upgrade --provider.cluster https://api.devnet.solana.com --provider.wallet ./upgrade-authority.json --filepath target/idl/drip.json F1NyoZsUhJzcpGyoEqpDNbUMKVvCnSXcCki1nN3ycAeo
solana program deploy --keypair ./upgrade-authority.json --upgrade-authority ./upgrade-authority.json --program-id ./target/deploy/drip_v2-keypair.json ./target/deploy/drip_v2.so
# anchor deploy --program-name drip_v2 --provider.cluster https://quick-dark-dust.solana-mainnet.discover.quiknode.pro/67c6e7fd9430ec7c3cf355ce177b058d653a416e --provider.wallet ./upgrade-authority.json
# anchor idl init --provider.wallet ./upgrade-authority.json --filepath ./target/idl/drip_v2.json $PROGRAM_ID 