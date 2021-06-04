import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRepository } from './repositories/City.repository';
import { CountryRepository } from './repositories/Country.repository';
import { GenderRepository } from './repositories/Gender.repository';
import { LoggerRepository } from './repositories/Logger.repository';
import { ModuleRepository } from './repositories/Module.repository';
import { StateRepository } from './repositories/State.repository';
import { TokenRepository } from './repositories/Token.repository';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CityRepository,
      CountryRepository,
      GenderRepository,
      LoggerRepository,
      ModuleRepository,
      StateRepository,
      TokenRepository,
    ]),
  ],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
