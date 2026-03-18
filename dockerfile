FROM oven/bun:1
WORKDIR .
COPY . .
RUN bun install --frozen-lockfile
WORKDIR /apps/api
EXPOSE 3000
CMD ["bun", "run", "run:api"]