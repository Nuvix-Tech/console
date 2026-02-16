# syntax=docker.io/docker/dockerfile:1

# -----------------------
# Stage 0: Base
# -----------------------
FROM node:20-alpine AS base

WORKDIR /app

# Enable pnpm globally
RUN corepack enable

# -----------------------
# Stage 1: Dependencies
# -----------------------
FROM base AS deps

RUN apk add --no-cache libc6-compat

# Copy root manifests
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Copy package manifests for workspace resolution
COPY apps/console/package.json ./apps/console/
COPY apps/docs/package.json ./apps/docs/
COPY apps/www/package.json ./apps/www/

COPY packages/cui/package.json ./packages/cui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/pg-meta/package.json ./packages/pg-meta/
COPY packages/sui/package.json ./packages/sui/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile --ignore-scripts

# -----------------------
# Stage 2: Builder
# -----------------------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Placeholders for runtime replacement
ENV NEXT_PUBLIC_NUVIX_ENDPOINT=__NUVIX_DYNAMIC_NUVIX_ENDPOINT__
ENV NEXT_PUBLIC_SERVER_ENDPOINT=__NUVIX_DYNAMIC_SERVER_ENDPOINT__
ENV NEXT_TELEMETRY_DISABLED=1

# Build console
RUN pnpm run build

# -----------------------
# Stage 3: Runtime
# -----------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# OCI metadata
ARG VERSION=dev
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown

LABEL org.opencontainers.image.title="Nuvix Console" \
      org.opencontainers.image.description="Nuvix Web Console" \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$VCS_REF \
      org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.source="https://github.com/nuvix-dev/console" \
      org.opencontainers.image.licenses="BSD-3-Clause"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/apps/console/public ./apps/console/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/console/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/console/.next/static ./apps/console/.next/static

# Default fallback values
ENV NEXT_PUBLIC_NUVIX_ENDPOINT=http://localhost:4000/v1
ENV NEXT_PUBLIC_SERVER_ENDPOINT=http://localhost:4100

# Entrypoint script
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
: "${NEXT_PUBLIC_NUVIX_ENDPOINT:=http://localhost:4000/v1}"\n\
: "${NEXT_PUBLIC_SERVER_ENDPOINT:=http://localhost:4100}"\n\
\n\
echo "Starting Nuvix Console..."\n\
echo "NUVIX_ENDPOINT: $NEXT_PUBLIC_NUVIX_ENDPOINT"\n\
echo "SERVER_ENDPOINT: $NEXT_PUBLIC_SERVER_ENDPOINT"\n\
\n\
# Replace placeholders only inside console bundle\n\
find apps/console -type f -name "*.js" -exec sed -i "s|__NUVIX_DYNAMIC_NUVIX_ENDPOINT__|$NEXT_PUBLIC_NUVIX_ENDPOINT|g" {} +\n\
find apps/console -type f -name "*.js" -exec sed -i "s|__NUVIX_DYNAMIC_SERVER_ENDPOINT__|$NEXT_PUBLIC_SERVER_ENDPOINT|g" {} +\n\
\n\
exec node apps/console/server.js\n' > /entrypoint.sh \
 && chmod +x /entrypoint.sh

USER nextjs

EXPOSE 3000

# Healthcheck (simple availability test)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:$PORT/ >/dev/null || exit 1

ENTRYPOINT ["/entrypoint.sh"]
