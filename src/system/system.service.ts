import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/City.entity';
import { Country } from './entities/Country.entity';
import { State } from './entities/State.entity';
import { CityRepository } from './repositories/City.repository';
import { CountryRepository } from './repositories/Country.repository';
import { StateRepository } from './repositories/State.repository';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(CountryRepository)
    private countryRepository: CountryRepository,

    @InjectRepository(StateRepository)
    private stateRepository: StateRepository,

    @InjectRepository(CityRepository)
    private cityRepository: CityRepository,
  ) {}

  async getCountries(): Promise<{ data: Country[]; count: number }> {
    return this.countryRepository.getCountries();
  }

  async getStates(): Promise<{ data: State[]; count: number }> {
    return await this.stateRepository.getStates();
  }

  async getCities(): Promise<{ data: City[]; count: number }> {
    return this.cityRepository.getCities();
  }
}
