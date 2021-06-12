import { Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesController } from './taxes.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { InvoiceDetailRepository } from 'src/invoices/repositories/InvoiceDetail.repository';
import { InvoicesDocumentTypeRepository } from 'src/invoices/repositories/InvoicesDocumentType.repository';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { InvoicesStatusRepository } from 'src/invoices/repositories/InvoicesStatus.repository';
import { TaxesRepository } from './repositories/taxes.repository';
import { PurchaseRepository } from 'src/purchases/repositories/Purchase.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      InvoiceRepository,
      InvoiceDetailRepository,
      InvoicesDocumentTypeRepository,
      CustomerRepository,
      InvoicesStatusRepository,
      TaxesRepository,
      PurchaseRepository,
    ]),
  ],

  providers: [TaxesService],
  controllers: [TaxesController],
})
export class TaxesModule {}
