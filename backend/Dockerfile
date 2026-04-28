FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source
COPY . ./

# Use PORT from environment (Cloud Run sets PORT)
ENV PORT 8080

EXPOSE 8080

CMD ["npm", "start"]
