import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceRepository } from './repositories/invoices.repository';
import { InvoicesDetailsRepository } from './repositories/invoices.details.repository';
import { InvoicesDocumentsRepository } from './repositories/invoices.documents.repository';
import { InvoicesDocumentTypesRepository } from './repositories/invoices.documentTypes.repository';
import { InvoicesPaymentsConditionsRepository } from './repositories/invoicesPaymentsConditions.repository';
import { InvoicesSellersRepository } from './repositories/invoices.sellers.repository';
import { InvoicesStatusesRepository } from './repositories/invoices.statuses.repository';
import { InvoicesZoneRepository } from './repositories/InvoicesZone.repository';
import { InvoicesService } from './services/invoices.service';
import { InvoicesController } from './controllers/invoices.controller';
import { AuthModule } from '../auth/auth.module';
import { CustomerRepository } from '../customers/repositories/Customer.repository';
import { CustomerBranchRepository } from '../customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from '../services/repositories/Service.repository';
import { InvoicesEntriesRecurrencyRepository } from './repositories/Invoices.entriesRecurrency.repository';
import { ModuleRepository } from '../system/repositories/Module.repository';
import { InvoicesIntegrationsRepository } from './repositories/invoices.integrations.repository';
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
import { InvoicesDocumentsController } from './controllers/invoices.documents.controller';
import { InvoicesDocumentsService } from './services/invoices.documents.service';
import { InvoicesStatusesController } from './controllers/invoices.statuses.controller';
import { InvoicesStatusService } from './services/invoices.status.service';
import { InvoicesZonesService } from './services/invoices.zones.service';
import { InvoicesZonesController } from './controllers/invoices.zones.controller';
import { InvoicesPaymentsConditionsService } from './services/invoices.paymentsConditions.service';
import { InvoicesPaymentsConditionsController } from './controllers/invoices.paymentsConditions.controller';
import { InvoicesSellersController } from './controllers/invoices.seller.controller';
import { InvoicesIntegrationsController } from './controllers/invoices.integrations.controller';
import { InvoicesIntegrationsService } from './services/invoices.integrations.service';
import { InvoicesSellersService } from './services/invoices.sellers.service';

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
      InvoicesDocumentsRepository,
      InvoicesDocumentTypesRepository,
      InvoicesPaymentsConditionsRepository,
      InvoicesSellersRepository,
      InvoicesStatusesRepository,
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
  exports: [InvoicesService, InvoicesIntegrationsService],
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
    InvoicesPaymentsConditionsService,
    InvoicesIntegrationsService,
    InvoicesSellersService,
  ],
  controllers: [
    InvoicesDocumentsController,
    InvoicesStatusesController,
    InvoicesZonesController,
    InvoicesPaymentsConditionsController,
    InvoicesIntegrationsController,
    InvoicesSellersController,
    InvoicesController,
  ],
})
export class InvoicesModule {}
