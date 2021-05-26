FROM node:lts-slim
WORKDIR /usr/app
COPY ./package.json ./
RUN npm i
COPY ./* ./
CMD ["npm", "run", "start"]