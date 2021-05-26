FROM node:lts-slim
RUN npm install --global yarn
WORKDIR /usr/app
COPY ./package.json ./
RUN npm i
COPY ./* ./
CMD ["npm", "run", "start"]