# Multi-stage Dockerfile for MOCK IDEA
# This Dockerfile builds the frontend service by default
# Use build args to specify which service to build

ARG SERVICE=frontend
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files first
COPY package*.json ./

# Copy service-specific package files
ARG SERVICE
COPY ${SERVICE}/package*.json ./${SERVICE}/
WORKDIR /app/${SERVICE}

# Install dependencies
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
ARG SERVICE
COPY --from=deps /app/${SERVICE}/node_modules ./${SERVICE}/node_modules

# Copy service source code
COPY ${SERVICE}/ ./${SERVICE}/
WORKDIR /app/${SERVICE}

# Build the application
RUN npm run build

# Production image, copy all the files and run the service
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built application
ARG SERVICE
COPY --from=builder /app/${SERVICE} ./

# Set ownership
RUN chown -R appuser:nodejs /app

USER appuser

# Expose port
EXPOSE 3000

# Default command (can be overridden)
CMD ["npm", "start"]
