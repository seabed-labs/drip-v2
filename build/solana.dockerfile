# 0.27.0 and below is under project serum
FROM projectserum/build:v0.27.0
# 0.28.0 and later are under backpackapp
# FROM backpackapp/build:v0.28.0

COPY ./solana-programs/local.json ./
COPY ./solana-programs/Cargo.lock ./
COPY ./solana-programs/Cargo.toml ./
COPY ./solana-programs/Anchor.toml ./
COPY ./solana-programs/programs ./programs/
RUN anchor build

COPY ./solana-programs/scripts ./scripts
ENV RUST_BACKTRACE=1

ENTRYPOINT [ "node", "./scripts/localnet.js" ]