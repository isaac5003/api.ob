import { Dependencies, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessRepository } from '../auth/repositories/Access.repository';
import { Company } from '../companies/entities/Company.entity';
import { City } from './entities/City.entity';
import { Country } from './entities/Country.entity';
import { State } from './entities/State.entity';
import { CityRepository } from './repositories/City.repository';
import { CountryRepository } from './repositories/Country.repository';
import { ModuleRepository } from './repositories/Module.repository';
import { StateRepository } from './repositories/State.repository';
import { EntriesService } from '../entries/entries.service';
import { InvoicesService } from '../invoices/services/invoices.service';
import { InvoicesIntegrationsService } from 'src/invoices/services/invoices.integrations.service';

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

    private entriesService: EntriesService,

    @Inject(forwardRef(() => InvoicesService))
    private invoicesService: InvoicesService,

    private invoicesIntegrationsService: InvoicesIntegrationsService,
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
  async hasIntegration(
    company: Company,
    receivedModule: string,
    integratedModule: string,
    companiesWithIntegrations: string[],
  ): Promise<boolean> {
    if (!(companiesWithIntegrations as any as string[]).includes(company.id)) {
      return false;
    }
    const integrateModule = await this.moduleRepository.getModule(integratedModule);
    const receiveModule = await this.moduleRepository.getModule(receivedModule);

    switch (receiveModule.shortName) {
      case 'invoices':
        const invoicesIntergation = await this.invoicesIntegrationsService.getInvoicesIntegrations(company, 'entries');
        switch (integrateModule.shortName) {
          case 'entries':
            const { data } = await this.entriesService.getSettings(company, 'general');

            return (
              invoicesIntergation.entries.activeIntegration,
              invoicesIntergation.entries.recurrencyFrecuency,
              invoicesIntergation.entries.cashPaymentAccountingCatalog &&
              data.accountingDebitCatalog &&
              data.accountingDebitCatalog
                ? true
                : false
            );
        }
        break;
    }
  }
}

@Dependencies(SystemService)
export class SystemDependentService {
  constructor(systemService) {
    systemService = systemService;
  }
}
