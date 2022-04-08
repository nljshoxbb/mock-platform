FROM node:16.13.1-alpine

RUN mkdir -p /usr/src/mock-platform

WORKDIR /usr/src/mock-platform

COPY package.json  ./

COPY . .

RUN npm i && npm i pm2 typescript tsc-alias -g
