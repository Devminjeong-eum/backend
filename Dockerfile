FROM node:20.12.2-alpine3.18 AS base
LABEL maintainer="gwangin1999@naver.com"

WORKDIR /app

RUN npm install -g pnpm

RUN --mount=type=cache,id=pnmcache,target=/var/pnpm/store \
  --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  pnpm config set store-dir /var/pnpm/store && \
  pnpm config set package-import-method copy && \
  pnpm install --prefer-offline --ignore-scripts --frozen-lockfile

FROM base as builder
RUN --mount=type=cache,id=pnmcache,target=/var/pnpm/store \
  --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
  --mount=type=bind,source=src,target=src \
    pnpm build

FROM node:20.12.2-alpine3.18 AS runner
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

ENV NODE_ENV production
USER node
CMD ["node", "dist/main"]