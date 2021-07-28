import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { InvoiceRepository } from 'src/invoices/repositories/invoices.repository';
import { EchargesController } from './echarges.controller';
import { EchargesService } from './echarges.service';
import { EchargesRepository } from './repositories/echarges.repository';
import { EchargesRequestRepository } from './repositories/echargesRequest.repository';
import { EchargesResponsesRepository } from './repositories/echargesResponse.repository';
import { EchargesStatusRepository } from './repositories/echargesStatus.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      EchargesRepository,
      EchargesRequestRepository,
      EchargesResponsesRepository,
      EchargesStatusRepository,
      InvoiceRepository,
      CustomerRepository,
    ]),
  ],
  controllers: [EchargesController],
  providers: [EchargesService],
})
export class EchargesModule {}
