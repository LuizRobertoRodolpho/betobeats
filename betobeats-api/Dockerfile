FROM node:16.10-alpine

RUN mkdir app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN rm -rf node_modules

WORKDIR /app

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 3006

CMD [ "node", "server.js" ]
