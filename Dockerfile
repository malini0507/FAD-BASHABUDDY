# Production Dockerfile for BhashaBuddy
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY database ./database
COPY backend ./backend
COPY frontend ./frontend

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
