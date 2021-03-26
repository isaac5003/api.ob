import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './repositories/Customer.repository';
import { CustomerBranchRepository } from './repositories/CustomerBranch.repository';
import { CustomerSettingRepository } from './repositories/CustomerSetting.repository';
import { CustomerTaxerTypeRepository } from './repositories/CustomerTaxerType.repository';
import { CustomerTypeRepository } from './repositories/CustomerType.repository';
import { CustomerTypeNaturalRepository } from './repositories/CustomerTypeNatural.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      CustomerBranchRepository,
      CustomerSettingRepository,
      CustomerTaxerTypeRepository,
      CustomerTypeRepository,
      CustomerTypeNaturalRepository,
    ]),
  ],
})
export class CustomersModule {}
