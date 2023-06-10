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
