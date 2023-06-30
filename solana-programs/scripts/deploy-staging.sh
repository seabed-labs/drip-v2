CODE_DEFINED_PROGRAM_ID="74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk"
PROGRAM_ID=$(solana-keygen pubkey ./target/deploy/drip_v2-keypair.json)

# Replace Program ID 
find . -name '*.toml' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;
find . -name '*.rs' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;
find . -name '*.ts' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;
find . -name '*.json' -exec sed -i -e "s/$CODE_DEFINED_PROGRAM_ID/$PROGRAM_ID/g" {} \;

rm -rf **/*.rs-e
rm -rf **/*.toml-e
rm -rf ./target

anchor build --verifiable

PROGRAM_ID=$(solana-keygen pubkey ./drip_v2-keypair.json)
UPGRADE_AUTH=$(solana-keygen pubkey ./upgrade-authority.json)
echo "Program ID"
echo $PROGRAM_ID
echo "Upgrade Authority"
echo $UPGRADE_AUTH
solana balance $UPGRADE_AUTH
