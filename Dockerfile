FROM node:lts-slim
WORKDIR /usr/api
COPY ./package.json ./
RUN npm i
COPY ./src ./src
CMD ["npm", "run", "start"]