import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './_config/typeorm.config';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ServicesModule, AuthModule, CustomersModule],
})
export class AppModule {}
