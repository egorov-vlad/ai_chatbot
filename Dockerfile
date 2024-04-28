FROM oven/bun:1 as base

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY src src
COPY .env .
COPY tsconfig.json .


RUN bun install --production

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]