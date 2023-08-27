FROM node:16.15.0-alpine AS base

WORKDIR /project

FROM base AS dependencies

RUN apk --no-cache add curl

COPY .eslintrc .
COPY tsconfig.json .
COPY package.json .
COPY yarn.lock .
RUN yarn install --production --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types/package.json packages/drip-types/
COPY packages/drip-sdk/package.json packages/drip-sdk/
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/
RUN cd apps/api && yarn install --pure-lockfile --non-interactive --cache-folder ./ycache; rm -rf ./ycache

COPY packages/drip-types/ packages/drip-types
COPY packages/drip-sdk/ packages/sdk
COPY apps/api/ apps/api

WORKDIR /project/apps/api

RUN yarn build

ENTRYPOINT [ "yarn", "start" ]