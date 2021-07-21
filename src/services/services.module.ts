import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRepository } from './repositories/Service.repository';
import { SellingTypeRepository } from './repositories/SellingType.repository';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceIntegrationsRepository } from './repositories/ServiceIntegrations.repository';
import { AuthModule } from '../auth/auth.module';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { ModuleRepository } from '../system/repositories/Module.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ServiceRepository,
      SellingTypeRepository,
      ServiceIntegrationsRepository,
      AccountingCatalogRepository,
      ModuleRepository,
    ]),
  ],
  exports: [ServicesService],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
