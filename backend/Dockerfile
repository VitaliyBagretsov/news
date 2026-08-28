FROM node:22-alpine AS builder

WORKDIR /news

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS production
WORKDIR /news

COPY --from=builder /news/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /news/dist ./dist/

CMD ["node", "dist/main.js"]
