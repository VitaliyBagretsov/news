# news/frontend/Dockerfile
FROM node:20-alpine as builder

WORKDIR /news

COPY package.json ./

RUN npm i

COPY . .

RUN npm run build

FROM node:20-alpine as production
WORKDIR /news

COPY --from=builder /news/package*.json ./

RUN npm i --prod

COPY --from=builder /news/dist ./dist/

CMD ["echo", "start frontend"]