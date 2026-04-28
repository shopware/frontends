# Build stage
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

# Copy source files
COPY . .

RUN pnpm build

# Production stage
FROM node:24-alpine AS runner

WORKDIR /app

# Create tmp directory for runtime writes (mount as tmpfs when running read-only)
RUN mkdir -p /app/tmp && chown node:node /app/tmp

# Copy built output from builder (standalone, no deps needed)
COPY --from=builder --chown=node:node /app/.output ./.output

# Use non-root user for security
USER node

# Point Node.js temp operations to /app/tmp
ENV TMPDIR=/app/tmp

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
