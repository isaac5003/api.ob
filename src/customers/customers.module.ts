import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './repositories/Customer.repository';
import { CustomerBranchRepository } from './repositories/CustomerBranch.repository';
import { CustomerSettingRepository } from './repositories/CustomerSetting.repository';
import { CustomerTaxerTypeRepository } from './repositories/CustomerTaxerType.repository';
import { CustomerTypeRepository } from './repositories/CustomerType.repository';
import { CustomerTypeNaturalRepository } from './repositories/CustomerTypeNatural.repository';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';

@Module({
  imports: [
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
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
