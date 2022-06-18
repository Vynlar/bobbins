FROM node:18-alpine

COPY package*.json .

RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing --repository http://dl-cdn.alpinelinux.org/alpine/edge/main openscad

RUN npm ci

COPY . .

RUN npm run css:build
RUN mkdir out
RUN mkdir params

CMD ["node", "index.mjs"]
