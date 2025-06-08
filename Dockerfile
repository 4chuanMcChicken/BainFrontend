# ---------------------
# 1) Build stage
# ---------------------
FROM node:20-alpine AS builder
WORKDIR /app


COPY .env.production .env


COPY package*.json ./
RUN npm install


COPY . .


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


RUN npm run build

# ---------------------
# 2) Runtime stage
# ---------------------
FROM node:20-alpine
WORKDIR /app


COPY --from=builder /app/build-node/ ./

EXPOSE 3000
CMD ["node", "index.js"]
    