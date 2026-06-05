FROM oven/bun:latest AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bunx prisma generate
RUN bun run build


FROM oven/bun:latest AS prod
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lock .
COPY --from=builder /app/prisma.config.ts .
COPY --from=builder /app/.env .
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/prisma/ ./prisma
RUN bun install --production --frozen-lockfile
RUN bunx prisma generate

COPY .env ./.env


EXPOSE 3000
CMD ["bun", "run", "start:prod"]
