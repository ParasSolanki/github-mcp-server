FROM node:22.12-bullseye-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
ENV NODE_ENV="production"
ARG GITHUB_PERSONAL_ACCESS_TOKEN
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /node_modules
COPY --from=build /app/dist /dist

ENTRYPOINT  [ "node", "dist/app.js" ]
