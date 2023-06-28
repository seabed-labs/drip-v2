# Drip V2

## Contributing

1. Follow https://www.conventionalcommits.org/en/v1.0.0/

## Program

<details>
<summary>Expand for details</summary>

### Setup (program)

1. Install Rust v1.17.0

https://www.rust-lang.org/tools/install

2. Install Solana v1.14.17

```sh
sh -c "$(curl -sSfL https://release.solana.com/v1.14.17/install)"
```

3. Install avm (Anchor Version Manager)

```sh
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

On linux systems:

```sh
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```

4. Install anchor v0.27.0

```sh
avm install 0.27.0 && avm use 0.27.0
```

### Build (program)

```sh
anchor build
```

### Tests (program)

```sh
anchor test
```

</details>

## xNFT

<details>
<summary>Expand for details</summary>

### Setup (xNFT)

WIP

### Run (xNFT)

</details>

## Setting up dummy drip positions

<details>
<summary>Expand for details</summary>

### Setup on-chain stuff

1. Navigate to `solana-programs`
2. Start up the node (Retry after running `yarn` if you have problems)

```bash
yarn localnet
```

3. Wait for the logs to say `DONE SETUP`
4. Open `solana-programs/mocks/setup.json` and you should see a `dripPositions` field. This field holds `positionPubkey` sub-fields that are valid pubkeys for real drip position accounts that have been created in your local node.

### Setup fetcher

1. Naviate to `services/fetcher`
2. Create a `.env` file with the following contents

```
FETCHER_RPC_URL=http://localhost:8899
DRIP_PROGRAM_ID=74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk
```

3. Start the fetcher (Retry after running `yarn` if you have problems)

```bash
yarn dev
```

4. Ping the fetcher at `http://localhost:3000` to make sure its running
5. Fetch an account using `http://localhost:3000/fetch/account/<insert a valid drip position pubkey here>`

### Run (xNFT)

</details>
