FROM node:lts-slim
RUN apk --no-cache add --virtual builds-deps build-base python
WORKDIR /usr/app
COPY ./package.json ./package.json
COPY ./nest-cli.json ./nest-cli.json
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json
COPY .prettierrc ./.prettierrc
COPY .eslintrc.js ./.eslintrc.js
RUN npm i
COPY ./src ./src
CMD ["npm", "run", "start"]