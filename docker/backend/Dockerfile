FROM node:20.12.2-alpine3.18 AS base
LABEL maintainer="gwangin1999@naver.com"

RUN npm install -g pnpm

FROM base as deps
WORKDIR /app
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

USER node

FROM base as builder
WORKDIR /app

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

ENV NODE_ENV production
USER node
CMD ["node", "dist/main"]