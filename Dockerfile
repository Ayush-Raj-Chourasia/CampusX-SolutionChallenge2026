FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Set default backend API URL - can be overridden at build time
ARG VITE_API_URL=https://campusx-backend-asia-south1.run.app
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist /app/dist

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
