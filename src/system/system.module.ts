import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntriesModule } from '../entries/entries.module';
import { EntriesDependsService } from '../entries/entries.service';
import { AccessRepository } from '../auth/repositories/Access.repository';
import { CityRepository } from './repositories/City.repository';
import { CountryRepository } from './repositories/Country.repository';
import { GenderRepository } from './repositories/Gender.repository';
import { LoggerRepository } from './repositories/Logger.repository';
import { ModuleRepository } from './repositories/Module.repository';
import { StateRepository } from './repositories/State.repository';
import { TokenRepository } from './repositories/Token.repository';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { InvoicesDependendService } from '../invoices/invoices.service';

@Module({
  imports: [
    EntriesModule,
    forwardRef(() => InvoicesModule),
    TypeOrmModule.forFeature([
      CityRepository,
      CountryRepository,
      GenderRepository,
      LoggerRepository,
      ModuleRepository,
      StateRepository,
      TokenRepository,
      AccessRepository,
      ModuleRepository,
    ]),
  ],
  exports: [SystemService],
  controllers: [SystemController],
  providers: [SystemService, EntriesDependsService, InvoicesDependendService],
})
export class SystemModule {}
