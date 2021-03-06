import { Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesController } from './taxes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceRepository } from 'src/invoices/repositories/invoices.repository';
import { InvoicesDetailsRepository } from 'src/invoices/repositories/invoices.details.repository';
import { InvoicesDocumentTypesRepository } from 'src/invoices/repositories/invoices.documentTypes.repository';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { InvoicesStatusesRepository } from 'src/invoices/repositories/invoices.statuses.repository';
import { TaxesRepository } from './repositories/taxes.repository';
import { PurchaseRepository } from 'src/purchases/repositories/Purchase.repository';
import { PurchasesDocumentTypeRepository } from 'src/purchases/repositories/PurchaseDocumentType.repository';
import { PurchasesStatusRepository } from 'src/purchases/repositories/PurchaseStatus.repository';
import { PurchaseDetailRepository } from 'src/purchases/repositories/PurchaseDetail.repository';
import { AuthDependentService } from 'src/auth/auth.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      InvoiceRepository,
      InvoicesDetailsRepository,
      InvoicesDocumentTypesRepository,
      CustomerRepository,
      InvoicesStatusesRepository,
      TaxesRepository,
      PurchaseRepository,
      PurchasesStatusRepository,
      PurchasesDocumentTypeRepository,
      PurchaseDetailRepository,
    ]),
  ],

  providers: [TaxesService, AuthDependentService],
  controllers: [TaxesController],
})
export class TaxesModule {}
