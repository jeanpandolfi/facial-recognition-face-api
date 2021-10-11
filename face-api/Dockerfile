FROM node:14.18-alpine

WORKDIR /home/face-api

COPY packege*.json /home/face-api/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]