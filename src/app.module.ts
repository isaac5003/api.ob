import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ServicesModule],
})
export class AppModule {}
