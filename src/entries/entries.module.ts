import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingCatalogRepository } from './repositories/AccountingCatalog.repository';
import { AccountingEntryRepository } from './repositories/AccountingEntry.repository';
import { AccountingEntryDetailRepository } from './repositories/AccountingEntryDetail.repository';
import { AccountingEntryTypeRepository } from './repositories/AccountingEntryType.repository';
import { AccountingRegisterTypeRepository } from './repositories/AccountingRegisterType.repository';
import { AccountingSettingRepository } from './repositories/AccountingSetting.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountingCatalogRepository,
      AccountingEntryRepository,
      AccountingEntryDetailRepository,
      AccountingEntryTypeRepository,
      AccountingRegisterTypeRepository,
      AccountingSettingRepository,
    ]),
  ],
})
export class EntriesModule {}
