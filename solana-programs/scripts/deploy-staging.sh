avm use 0.27.0

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
anchor build

echo "Program ID"
echo $PROGRAM_ID
echo "Upgrade Authority"
echo $UPGRADE_AUTH

anchor upgrade --program-id="$PROGRAM_ID" --provider.cluster="https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d" --provider.wallet="./upgrade-authority.json" ./target/deploy/drip_v2.so
anchor idl upgrade --provider.cluster="https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d" --provider.wallet="./upgrade-authority.json" --filepath="target/idl/drip.json" $PROGRAM_ID

#solana program deploy --keypair ./upgrade-authority.json --upgrade-authority ./upgrade-authority.json --program-id ./target/deploy/drip_v2-keypair.json ./target/deploy/drip_v2.so
#anchor idl init --provider.cluster="https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d" --provider.wallet="./upgrade-authority.json" --filepath="./target/idl/drip_v2.json" $PROGRAM_ID