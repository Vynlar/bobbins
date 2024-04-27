FROM --platform=linux/arm64 node:18-slim

COPY package.json .
COPY package-lock.json .

RUN apt-get update && apt-get install -y openscad

RUN npm ci

COPY . .

RUN npm run css:build
RUN mkdir out
RUN mkdir params

CMD ["node", "index.mjs"]
