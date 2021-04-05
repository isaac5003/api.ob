import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { AuthModule } from 'src/auth/auth.module';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { CustomerBranchRepository } from 'src/customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from 'src/services/repositories/Service.repository';

@Module({
  imports: [
    AuthModule,
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
    ]),
  ],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
