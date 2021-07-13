import { join } from 'path';
import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
dotenv.config({ path: process.env.PATH });

const ormconfig: TypeOrmModuleOptions = {
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

export default ormconfig;
