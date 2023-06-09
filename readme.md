# Drip V2

## Setup (program)

1. Install Rust v1.17.0

https://www.rust-lang.org/tools/install

2. Install Solana v1.14.17

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.14.17/install)"
```

3. Install avm (Anchor Version Manager)

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

On linux systems:

```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```

4. Install anchor v0.27.0

```bash
avm install 0.27.0 && avm use 0.27.0
```
