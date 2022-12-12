FROM node:12-alpine

WORKDIR /app

COPY package.json tsconfig.json /app/

RUN npm install

COPY src /app

ENTRYPOINT [ "npm", "run", "start" ]
