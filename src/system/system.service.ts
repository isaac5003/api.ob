import { Dependencies, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRepository } from 'src/auth/repositories/Access.repository';
import { Company } from 'src/companies/entities/Company.entity';
import { InvoicesIntegrationsRepository } from 'src/invoices/repositories/InvoicesIntegration.repository';
import { City } from './entities/City.entity';
import { Country } from './entities/Country.entity';
import { State } from './entities/State.entity';
import { CityRepository } from './repositories/City.repository';
import { CountryRepository } from './repositories/Country.repository';
import { ModuleRepository } from './repositories/Module.repository';
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

    @InjectRepository(ModuleRepository)
    private moduleRepository: ModuleRepository,

    @InjectRepository(InvoicesIntegrationsRepository)
    private invoicesIntegrationsRepository: InvoicesIntegrationsRepository,
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

  /**
   * Metodo utilizado para validar si un modulo posee integraciones activas con otro modulo en
   * especifico.
   * @param company compañia con la que esta logado el usuario que invoca el metodo
   * @param receivedModule id del modulo del que parte la integración
   * @param integratedModule  id del modulo con el que tiene integracion el receivedModule
   * @returns true o false dependiendo el caso
   */
  async hasIntegration(company: Company, receivedModule: string, integratedModule: string): Promise<boolean> {
    const companiesWithIntegrations = await this.accessRepository.getCompaniesWithIntegrations(
      receivedModule,
      integratedModule,
    );

    if (!(companiesWithIntegrations as any as string[]).includes(company.id)) {
      return false;
    }
    const integrateModule = await this.moduleRepository.getModule(integratedModule);
    const receiveModule = await this.moduleRepository.getModule(receivedModule);

    switch (receiveModule.shortName) {
      case 'invoices':
        const invoicesIntergation = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
        switch (integrateModule.shortName) {
          case 'entries':
            const response = invoicesIntergation.find(
              (i) => i.metaKey == 'activeIntegration' && i.module.id == integratedModule,
            );

            return response ? (response.metaValue == 'true' ? true : false) : false;
        }
        break;
    }
  }
}

@Dependencies(SystemService)
export class SystemDependendService {
  constructor(systemService) {
    systemService = systemService;
  }
}
