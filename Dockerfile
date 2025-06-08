# ---------------------
#  Build stage
# ---------------------
FROM node:20-alpine AS builder
WORKDIR /app

ARG PUBLIC_API_BASE_URL
ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .

# 用 adapter-node 在 /app/build-node 里输出
RUN npm run build

# ---------------------
#  Runtime stage
# ---------------------
FROM node:20-alpine
WORKDIR /app

# 把 builder 阶段 /app/build-node/ 目录下所有文件拷到当前 /app
COPY --from=builder /app/build-node/ ./

EXPOSE 3000

CMD ["node", "index.js"]
    