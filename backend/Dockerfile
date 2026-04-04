FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including devDeps) for the build step
RUN npm ci

COPY . .

RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove devDependencies after build (keep image lean)
RUN npm prune --production

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]