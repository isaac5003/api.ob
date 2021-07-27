import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';
import { InvoiceRepository } from './repositories/Invoice.repository';
import { InvoiceDetailRepository } from './repositories/InvoiceDetail.repository';
import { InvoicesDocumentRepository } from './repositories/InvoicesDocument.repository';
import { InvoicesDocumentTypeRepository } from './repositories/InvoicesDocumentType.repository';
import { InvoicesPaymentsConditionRepository } from './repositories/InvoicesPaymentsCondition.repository';
import { InvoicesSellerRepository } from './repositories/InvoicesSeller.repository';
import { InvoicesStatusRepository } from './repositories/InvoicesStatus.repository';
import { InvoicesZoneRepository } from './repositories/InvoicesZone.repository';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { AuthModule } from '../auth/auth.module';
import { CustomerRepository } from '../customers/repositories/Customer.repository';
import { CustomerBranchRepository } from '../customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from '../services/repositories/Service.repository';
import { InvoicesEntriesRecurrencyRepository } from './repositories/InvoiceEntriesRecurrency.repository';
import { ModuleRepository } from '../system/repositories/Module.repository';
import { InvoicesIntegrationsRepository } from './repositories/InvoicesIntegration.repository';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { DependentController } from '../auth/auth.service';
import { AccessRepository } from '../auth/repositories/Access.repository';
import { CustomerDependsService } from '../customers/customers.service';
import { CustomersModule } from '../customers/customers.module';
import { EntriesDependsService } from '../entries/entries.service';
import { EntriesModule } from '../entries/entries.module';
import { ServiceDependsService } from '../services/services.service';
import { ServicesModule } from '../services/services.module';
import { SystemDependendService } from '../system/system.service';
import { SystemModule } from '../system/system.module';
import { InvoicesDocumentController } from './controllers/invoices.document.controller';
import { InvoicesDocumentsService } from './services/invoices.documents.service';

@Module({
  imports: [
    AuthModule,
    CustomersModule,
    EntriesModule,
    ServicesModule,
    SystemModule,
    RouterModule.register([]),
    TypeOrmModule.forFeature([
      InvoiceRepository,
      InvoiceDetailRepository,
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
  exports: [InvoicesService],
  providers: [
    InvoicesService,
    DependentController,
    CustomerDependsService,
    EntriesDependsService,
    ServiceDependsService,
    SystemDependendService,
    InvoicesDocumentsService,
  ],
  controllers: [InvoicesController, InvoicesDocumentController],
})
export class InvoicesModule {}
