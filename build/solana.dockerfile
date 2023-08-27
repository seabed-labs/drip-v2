# 0.27.0 and below is under project serum
# FROM projectserum/build:v0.27.0

# 0.28.0 and later are under backpackapp
FROM backpackapp/build:v0.28.0

WORKDIR /project

COPY program-library/local.json program-library/
COPY program-library/Cargo.lock program-library/
COPY program-library/Cargo.toml program-library/
COPY program-library/Anchor.toml program-library/
COPY program-library/programs program-library/programs/
RUN cd program-library && anchor build

COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types/package.json packages/drip-types/
COPY packages/drip-sdk/package.json packages/drip-sdk/
COPY program-library/package.json program-library/
COPY program-library/tsconfig.json program-library/
RUN cd program-library && yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types packages/drip-types
COPY packages/sdk packages/sdk

COPY program-library/scripts program-library/scripts
ENV RUST_BACKTRACE=1

WORKDIR /project/program-library

CMD [ "yarn", "run", "localnet" ]