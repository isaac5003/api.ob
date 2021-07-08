import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { CustomerBranchRepository } from 'src/customers/repositories/CustomerBranch.repository';
import { CustomerSettingRepository } from 'src/customers/repositories/CustomerSetting.repository';
import { CustomerTaxerTypeRepository } from 'src/customers/repositories/CustomerTaxerType.repository';
import { CustomerTypeRepository } from 'src/customers/repositories/CustomerType.repository';
import { CustomerTypeNaturalRepository } from 'src/customers/repositories/CustomerTypeNatural.repository';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';
import { ProvidersController } from './providers.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CustomerRepository,
      CustomerBranchRepository,
      CustomerSettingRepository,
      CustomerTaxerTypeRepository,
      CustomerTypeRepository,
      CustomerTypeNaturalRepository,
      AccountingCatalogRepository,
    ]),
  ],
  controllers: [ProvidersController],
  providers: [CustomersService],
})
export class ProvidersModule {}
