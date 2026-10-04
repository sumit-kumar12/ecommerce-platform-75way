FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app /app
RUN npm prune --omit=dev
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app
USER appuser
EXPOSE 4000
CMD ["node", "src/server.js"]
