# ---------------------
# 1) Build stage
# ---------------------
FROM node:20-alpine AS builder
WORKDIR /app

# 让 Vite 自动加载 env 文件
COPY .env.production .env.production
# 如果你在本地也需要 .env 开发变量，可同时拷进来
COPY .env .env

COPY package*.json ./
RUN npm install

COPY . .
# 强制使用 production 模式，让 Vite 读取 .env.production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# 生成 SSR 输出到 /app/build-node
RUN npm run build

# ---------------------
# 2) Runtime stage
# ---------------------
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/build-node/ ./

EXPOSE 3000
CMD ["node", "index.js"]
