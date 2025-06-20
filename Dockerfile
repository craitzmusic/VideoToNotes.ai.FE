FROM node:20-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .