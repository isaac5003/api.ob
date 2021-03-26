import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './_config/typeorm.config';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ServicesModule, AuthModule, CustomersModule, InvoicesModule, EntriesModule],
})
export class AppModule {}
