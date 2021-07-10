import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
// import * as dotenv from 'dotenv';
require('dotenv').config({ path: './local.env' });
// dotenv.config({ path: '/local.env' });
ConfigModule.forRoot();

console.log(process.env.POSTGRES_HOST);
module.exports = {
  type: 'postgres',

  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  migrations: [join(__dirname, 'src/migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: './src/migrations',
  },
};

// module.exports = typeOrmConfig;
