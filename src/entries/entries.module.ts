import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingCatalogRepository } from './repositories/AccountingCatalog.repository';
import { AccountingEntryRepository } from './repositories/AccountingEntry.repository';
import { AccountingEntryDetailRepository } from './repositories/AccountingEntryDetail.repository';
import { AccountingEntryTypeRepository } from './repositories/AccountingEntryType.repository';
import { AccountingSettingRepository } from './repositories/AccountingSetting.repository';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AccountingCatalogRepository,
      AccountingEntryRepository,
      AccountingEntryDetailRepository,
      AccountingEntryTypeRepository,
      AccountingSettingRepository,
    ]),
  ],
  providers: [EntriesService],
  controllers: [EntriesController],
})
export class EntriesModule {}
