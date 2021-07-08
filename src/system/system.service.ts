import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRepository } from 'src/auth/repositories/Access.repository';
import { Company } from 'src/companies/entities/Company.entity';
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

    @InjectRepository(AccessRepository)
    private accessRepository: AccessRepository,
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

  async hashIntegration(company: Company, receivedModule: string, integratedModule: string): Promise<boolean> {
    const companiesWithIntegrations = await this.accessRepository.getCompaniesWithIntegrations(
      receivedModule,
      integratedModule,
    );
    if (!companiesWithIntegrations.includes(company)) {
      return false;
    }

    switch (integratedModule) {
      case 'a98b98e6-b2d5-42a3-853d-9516f64eade8':
        break;
    }
  }
}
