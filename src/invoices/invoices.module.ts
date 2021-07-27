import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceRepository } from './repositories/invoices.repository';
import { InvoicesDetailsRepository } from './repositories/invoices.details.repository';
import { InvoicesDocumentRepository } from './repositories/InvoicesDocument.repository';
import { InvoicesDocumentTypeRepository } from './repositories/InvoicesDocumentType.repository';
import { InvoicesPaymentsConditionRepository } from './repositories/InvoicesPaymentsCondition.repository';
import { InvoicesSellerRepository } from './repositories/InvoicesSeller.repository';
import { InvoicesStatusRepository } from './repositories/InvoicesStatus.repository';
import { InvoicesZoneRepository } from './repositories/InvoicesZone.repository';
import { InvoicesService } from './services/invoices.service';
import { InvoicesController } from './controllers/invoices.controller';
import { AuthModule } from '../auth/auth.module';
import { CustomerRepository } from '../customers/repositories/Customer.repository';
import { CustomerBranchRepository } from '../customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from '../services/repositories/Service.repository';
import { InvoicesEntriesRecurrencyRepository } from './repositories/InvoiceEntriesRecurrency.repository';
import { ModuleRepository } from '../system/repositories/Module.repository';
import { InvoicesIntegrationsRepository } from './repositories/InvoicesIntegration.repository';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { AuthDependentService } from '../auth/auth.service';
import { AccessRepository } from '../auth/repositories/Access.repository';
import { CustomerDependentService } from '../customers/customers.service';
import { CustomersModule } from '../customers/customers.module';
import { EntriesDependentService } from '../entries/entries.service';
import { EntriesModule } from '../entries/entries.module';
import { ServiceDependentService } from '../services/services.service';
import { ServicesModule } from '../services/services.module';
import { SystemDependentService } from '../system/system.service';
import { SystemModule } from '../system/system.module';
import { InvoicesDocumentController } from './controllers/invoices.document.controller';
import { InvoicesDocumentsService } from './services/invoices.documents.service';
import { InvoicesStatusController } from './controllers/invoices.status.controller';
import { InvoicesStatusService } from './services/invoices.status.service';
import { InvoicesZonesService } from './services/invoices.zones.service';
import { InvoicesZonesController } from './controllers/invocies.zones.controller';
import { InvoicesPaymentsConditionService } from './services/invoices.paymentsCondition.service';
import { InvoicesPaymentsConditionController } from './controllers/invoices.paymentsCondition.controller';
import { InvoicesSellerService } from './services/invoices.seller.service';
import { InvoicesSellerController } from './controllers/invoices.seller.controller';
import { InvoicesSettingController } from './controllers/invoices.settings.controller';
import { InvoicesSettingService } from './services/invoices.settings.service';

@Module({
  imports: [
    AuthModule,
    CustomersModule,
    EntriesModule,
    ServicesModule,
    SystemModule,
    TypeOrmModule.forFeature([
      InvoiceRepository,
      InvoicesDetailsRepository,
      InvoicesDocumentRepository,
      InvoicesDocumentTypeRepository,
      InvoicesPaymentsConditionRepository,
      InvoicesSellerRepository,
      InvoicesStatusRepository,
      InvoicesZoneRepository,
      CustomerRepository,
      CustomerBranchRepository,
      ServiceRepository,
      InvoicesEntriesRecurrencyRepository,
      ModuleRepository,
      InvoicesIntegrationsRepository,
      AccountingCatalogRepository,
      AccessRepository,
    ]),
  ],
  exports: [InvoicesService, InvoicesSettingService],
  providers: [
    InvoicesService,
    AuthDependentService,
    CustomerDependentService,
    EntriesDependentService,
    ServiceDependentService,
    SystemDependentService,
    InvoicesDocumentsService,
    InvoicesStatusService,
    InvoicesZonesService,
    InvoicesPaymentsConditionService,
    InvoicesSellerService,
    InvoicesSettingService,
  ],
  controllers: [
    InvoicesDocumentController,
    InvoicesStatusController,
    InvoicesZonesController,
    InvoicesPaymentsConditionController,
    InvoicesSellerController,
    InvoicesSettingController,
    InvoicesController,
  ],
})
export class InvoicesModule {}
