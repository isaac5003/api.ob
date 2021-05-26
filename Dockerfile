FROM node:lts-slim
WORKDIR /usr/app
COPY ./package.json ./
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./
COPY .prettierrc ./
COPY .eslintrc.js ./
RUN npm i
COPY ./src ./src
CMD ["npm", "run", "start"]