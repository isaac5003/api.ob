import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './repositories/Customer.repository';
import { CustomerBranchRepository } from './repositories/CustomerBranch.repository';
import { CustomerIntegrationsRepository } from './repositories/CustomerIntegrations.repository';
import { CustomerTaxerTypeRepository } from './repositories/CustomerTaxerType.repository';
import { CustomerTypeRepository } from './repositories/CustomerType.repository';
import { CustomerTypeNaturalRepository } from './repositories/CustomerTypeNatural.repository';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      CustomerBranchRepository,
      CustomerIntegrationsRepository,
      CustomerTaxerTypeRepository,
      CustomerTypeRepository,
      CustomerTypeNaturalRepository,
      AccountingCatalogRepository,
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
