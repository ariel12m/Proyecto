FROM oven/bun:latest AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bunx prisma generate
RUN bun run build


FROM oven/bun:latest AS prod
WORKDIR /app
COPY --from=builder /app/package.json /app/bun.lock /app/dist /app/prisma ./
RUN bun install --production --frozen-lockfile
RUN bunx prisma generate

EXPOSE 3000
CMD ["bun", "run", "start:prod"]
