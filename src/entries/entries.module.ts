import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingCatalogRepository } from './repositories/AccountingCatalog.repository';
import { AccountingEntryRepository } from './repositories/AccountingEntry.repository';
import { AccountingEntryDetailRepository } from './repositories/AccountingEntryDetail.repository';
import { AccountingEntryTypeRepository } from './repositories/AccountingEntryType.repository';
import { AccountingRegisterTypeRepository } from './repositories/AccountingRegisterType.repository';
import { AccountingSettingRepository } from './repositories/AccountingSetting.repository';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AccountingCatalogRepository,
      AccountingEntryRepository,
      AccountingEntryDetailRepository,
      AccountingEntryTypeRepository,
      AccountingRegisterTypeRepository,
      AccountingSettingRepository,
    ]),
  ],
  providers: [EntriesService],
  controllers: [EntriesController],
})
export class EntriesModule {}
