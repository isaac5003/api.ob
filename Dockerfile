FROM node:lts-slim
WORKDIR /usr/app
COPY ./package.json ./
RUN yarn install
COPY ./* ./
CMD ["npm", "run", "start"]