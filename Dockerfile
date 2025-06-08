# ---------------------
# 1) Build stage
# ---------------------
FROM node:20-alpine AS builder
WORKDIR /app

# 定义所有需要的构建参数
ARG PUBLIC_API_BASE_URL
ARG PUBLIC_GOOGLE_MAPS_API_KEY
ARG PUBLIC_RECAPTCHA_SITE_KEY

# 设置构建时的环境变量
ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL
ENV PUBLIC_GOOGLE_MAPS_API_KEY=$PUBLIC_GOOGLE_MAPS_API_KEY
ENV PUBLIC_RECAPTCHA_SITE_KEY=$PUBLIC_RECAPTCHA_SITE_KEY

COPY .env.production .env

COPY package*.json ./
RUN npm install

COPY . .

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
