FROM node:22-alpine as base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

FROM base as dev
COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]