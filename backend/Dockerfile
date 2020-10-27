FROM node:14-alpine

WORKDIR /usr/src

COPY yarn.lock .
COPY package.json .

COPY backend backend

RUN ls -la

RUN yarn install --pure-lockfile --non-interactive