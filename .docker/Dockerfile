# syntax=docker/dockerfile:1.7

FROM oven/bun:1-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


FROM oven/bun:1-alpine AS builder

WORKDIR /app

ARG NEXT_STANDALONE=true

ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_STANDALONE=${NEXT_STANDALONE}

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# The standalone image copy is valid even when the project has no public assets yet.
RUN mkdir -p public && bun run build


FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NEXT_STANDALONE_DIR=/app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs \
    && npm install --global pm2@6 \
    && npm cache clean --force

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs .docker/ecosystem.config.cjs ./ecosystem.config.cjs

USER nextjs

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.cjs"]
