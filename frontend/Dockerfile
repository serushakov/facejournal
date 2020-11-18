FROM node:14-alpine

WORKDIR /usr/src

COPY yarn.lock .
COPY package.json .

COPY frontend frontend

RUN yarn install --pure-lockfile --non-interactive