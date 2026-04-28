FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Pass empty VITE_API_URL - will be set at runtime via Cloud Run environment variable
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist /app/dist

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Health check - use PORT env var (Cloud Run sets it to 8080, default is 3000)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 3000; require('http').get('http://localhost:' + port, (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]
