FROM node:12-alpine

COPY package.json tsconfig.json /app/

WORKDIR /app

COPY api /app/api
COPY server.ts /app/server.ts

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
