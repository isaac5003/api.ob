import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './_config/typeorm.config';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ServicesModule, AuthModule],
})
export class AppModule {}
