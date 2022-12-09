FROM node:12-alpine

COPY package.json tsconfig.json /app/

WORKDIR /app

COPY src/api /app/api
COPY src/server.ts /app/server.ts

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
