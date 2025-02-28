FROM node:lts-alpine

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/logs

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "start"]
