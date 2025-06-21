# Stage 1: Build
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-bullseye-slim
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3000
RUN useradd -m appuser
USER appuser
CMD ["npm", "start"]