# news/backend/Dockerfile
FROM node:20-alpine as builder

WORKDIR /news

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:20-alpine as production
WORKDIR /news

COPY --from=builder /news/package*.json ./

RUN yarn --prod

COPY --from=builder /news/dist ./dist/
COPY --from=builder /news/public ./public/

EXPOSE 3000

CMD ["node", "dist/main"]