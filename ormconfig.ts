const { join } = require('path');
// import { join } from 'path';
const dotenv = require('dotenv');
// import * as dotenv from 'dotenv';
dotenv.config({ path: './local.env' });

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
  // migrationsRun: true,
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: './src/migrations',
  },
};