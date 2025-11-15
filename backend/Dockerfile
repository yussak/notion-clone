FROM node:22-alpine as base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

FROM base as dev
COPY . .
# RUN yarn prisma generate
EXPOSE 8080
CMD ["yarn", "dev"]