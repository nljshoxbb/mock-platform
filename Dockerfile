FROM node:12.16.3-alpine

RUN mkdir -p /usr/src/mock-platform

WORKDIR /usr/src/mock-platform

COPY package.json ./

COPY . .