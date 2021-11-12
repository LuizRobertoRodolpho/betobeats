FROM node:16.10-stretch

RUN mkdir app

RUN rm -rf node_modules

WORKDIR /app

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 3006

CMD [ "node", "index.js" ]
