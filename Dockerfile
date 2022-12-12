FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json /app/

RUN npm ci

COPY src /app/src

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "start" ]
