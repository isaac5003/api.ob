import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRepository } from './repositories/Service.repository';
import { SellingTypeRepository } from './repositories/SellingType.repository';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceSettingRepository } from './repositories/ServiceSetting.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ServiceRepository,
      SellingTypeRepository,
      ServiceSettingRepository,
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
