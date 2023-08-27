FROM node:16.15.0-alpine AS base

WORKDIR /project

FROM base AS dependencies

COPY .eslintrc .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types/package.json packages/drip-types/
COPY packages/drip-sdk/package.json packages/drip-sdk/
COPY apps/fetcher/package.json apps/fetcher/
RUN cd apps/fetcher && yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types/ packages/drip-types
COPY packages/drip-sdk/ packages/sdk
COPY apps/fetcher/ apps/fetcher

WORKDIR /project/apps/fetcher

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]