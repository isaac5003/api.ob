import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { CustomerBranchRepository } from 'src/customers/repositories/CustomerBranch.repository';
import { CustomerIntegrationsRepository } from 'src/customers/repositories/CustomerIntegrations.repository';
import { CustomerTaxerTypeRepository } from 'src/customers/repositories/CustomerTaxerType.repository';
import { PersonTypeRepository } from 'src/customers/repositories/customers.personType.repository';
import { CustomerTypeNaturalRepository } from 'src/customers/repositories/CustomerTypeNatural.repository';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';
import { ModuleRepository } from 'src/system/repositories/Module.repository';
import { ProvidersController } from './providers.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      CustomerBranchRepository,
      CustomerIntegrationsRepository,
      CustomerTaxerTypeRepository,
      PersonTypeRepository,
      CustomerTypeNaturalRepository,
      AccountingCatalogRepository,
      ModuleRepository,
    ]),
  ],
  controllers: [ProvidersController],
  providers: [CustomersService],
})
export class ProvidersModule {}
