FROM node:24-alpine

WORKDIR /app


COPY package.json ./

COPY pnpm-lock.yaml ./

RUN npm i -g pnpm && pnpm install --frozen-lockfile


COPY . .


CMD [ "node","worker.js" ]
