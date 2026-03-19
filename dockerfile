FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["bun", "run", "start"]