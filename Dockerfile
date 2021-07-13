FROM node:lts-slim
WORKDIR /usr/app
COPY ./ormconfig.ts ./
COPY ./package.json ./
COPY ./nest-cli.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./
COPY .prettierrc ./
COPY .eslintrc.js ./
RUN yarn install
COPY ./src ./src
COPY ./start.sh /
RUN chmod +x /start.sh
CMD ["/start.sh"]