import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormconfig from '../ormconfig';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { EntriesModule } from './entries/entries.module';
import { CompaniesModule } from './companies/companies.module';
import { SystemModule } from './system/system.module';
import { ProvidersModule } from './providers/providers.module';
import { TaxesModule } from './taxes/taxes.module';
import { PurchasesModule } from './purchases/purchases.module';
import { EchargesModule } from './echarges/echarges.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    RouterModule.register([
      {
        path: 'invoices',
        module: InvoicesModule,
      },
    ]),
    ScheduleModule.forRoot(),
    ServicesModule,
    AuthModule,
    CustomersModule,
    InvoicesModule,
    EntriesModule,
    CompaniesModule,
    SystemModule,
    ProvidersModule,
    TaxesModule,
    PurchasesModule,
    EchargesModule,
  ],
})
export class AppModule {}
