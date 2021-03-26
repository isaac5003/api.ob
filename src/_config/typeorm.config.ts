import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5000,
  username: 'local_openbox_user',
  password: 'super_complicated_password',
  database: 'local_openbox_database',
  autoLoadEntities: true,
  synchronize: true,
};
