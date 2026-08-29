FROM node:22-alpine AS builder

WORKDIR /news

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_BASE_PATH=/news/
ARG VITE_API_URL=/news/api
ENV VITE_BASE_PATH=${VITE_BASE_PATH}
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginx:1.28-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /news/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget --quiet --output-document=- http://127.0.0.1/healthz >/dev/null || exit 1
