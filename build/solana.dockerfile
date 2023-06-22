# 0.27.0 and below is under project serum
FROM projectserum/build:v0.27.0

# 0.28.0 and later are under backpackapp
# FROM backpackapp/build:v0.28.0

WORKDIR /project

COPY solana-programs/local.json solana-programs/
COPY solana-programs/Cargo.lock solana-programs/
COPY solana-programs/Cargo.toml solana-programs/
COPY solana-programs/Anchor.toml solana-programs/
COPY solana-programs/programs solana-programs/programs/
RUN cd solana-programs && anchor build

COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types/package.json packages/drip-types/
COPY packages/sdk/package.json packages/sdk/
COPY solana-programs/package.json solana-programs/
RUN cd solana-programs && yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types packages/drip-types
COPY packages/sdk packages/sdk

COPY solana-programs/scripts solana-programs/scripts
ENV RUST_BACKTRACE=1

WORKDIR /project/solana-programs

CMD [ "yarn", "run", "localnet" ]