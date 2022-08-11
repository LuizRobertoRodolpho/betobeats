FROM node:14 as build

RUN mkdir app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN rm -rf node_modules

WORKDIR /app

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 3006

CMD [ "node", "start.js" ]
