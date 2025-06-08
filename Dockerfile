# ---------------------
#  Build stage
# ---------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ---------------------
#  Runtime stage
# ---------------------
FROM node:20-alpine
WORKDIR /app

# 只把打包产物拷进来
COPY --from=builder /app/build-node ./


EXPOSE 3000


CMD ["node", "index.js"]
    