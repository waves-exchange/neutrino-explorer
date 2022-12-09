FROM node:12-alpine

COPY package.json tsconfig.json /app/

WORKDIR /app

COPY src /app

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
