# Base Stage: Installs Node and copies dependency definitions
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./

# Development Stage: Installs all dependencies and runs dev server
FROM base AS development
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Production Stage: Installs only production dependencies and runs prod server
FROM base AS production
ENV NODE_ENV=production
RUN npm install --omit=dev
COPY . .
EXPOSE 8080
CMD ["npm", "run", "prod"]