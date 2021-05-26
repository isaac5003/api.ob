import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchRepository } from './repositories/Branch.repository';
import { CompanyRepository } from './repositories/Company.repository';
import { CompanyTypeRepository } from './repositories/CompanyType.repository';
import { NaturalTypeRepository } from './repositories/NaturalType.repository';
import { TaxerTypeRepository } from './repositories/TaxerType.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BranchRepository,
      CompanyRepository,
      CompanyTypeRepository,
      NaturalTypeRepository,
      TaxerTypeRepository,
    ]),
  ],
})
export class CompaniesModule {}
