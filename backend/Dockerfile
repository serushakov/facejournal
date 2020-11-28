FROM node:14

WORKDIR /usr/src

COPY yarn.lock .
COPY package.json .

COPY backend backend

RUN apt-get -q update && apt-get -qy install netcat

RUN yarn install --pure-lockfile --non-interactive