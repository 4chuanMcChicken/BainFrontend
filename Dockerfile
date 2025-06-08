# ---------------------
# 1) Build stage
# ---------------------
FROM node:20-alpine AS builder
WORKDIR /app

# 复制环境变量配置和package文件
COPY env.config.js package*.json ./

# 复制构建脚本
COPY scripts/build-env.js ./scripts/

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 生成环境变量并构建
RUN node scripts/build-env.js && npm run build

# ---------------------
# 2) Runtime stage
# ---------------------
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/build-node/ ./

EXPOSE 3000
CMD ["node", "index.js"]
