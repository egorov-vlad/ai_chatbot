FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY src src
COPY tsconfig.json .
COPY prisma ./prisma


RUN bun install --production

RUN bunx prisma generate

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]