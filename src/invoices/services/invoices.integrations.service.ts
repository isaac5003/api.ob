import { BadRequestException, Dependencies, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../companies/entities/Company.entity';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';
import { ModuleRepository } from '../../system/repositories/Module.repository';
import { ResponseMinimalDTO } from '../../_dtos/responseList.dto';
import { InvoiceIntegrationBaseDTO } from '../dtos/invoice-integration-base.dto';
import { InvoicesEntriesRecurrencyRepository } from '../repositories/Invoices.entriesRecurrency.repository';
import { InvoicesIntegrationsRepository } from '../repositories/invoices.integrations.repository';

@Injectable()
export class InvoicesIntegrationsService {
  constructor(
    @InjectRepository(InvoicesIntegrationsRepository)
    private invoicesIntegrationsRepository: InvoicesIntegrationsRepository,

    @InjectRepository(ModuleRepository)
    private moduleRepository: ModuleRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    @InjectRepository(InvoicesEntriesRecurrencyRepository)
    private invoicesEntriesRecurrencyRepository: InvoicesEntriesRecurrencyRepository,
  ) {}

  /**
   * Metodo para estructurar y validar los campos de configuración que se muestran en cada una
   * de las integraciones con otros modulos
   * @param company --Compañia con la que esta logado el usuario que solicita el metodo
   * @returns las configuraciones almacenadas de las integraciones con los diferentes modulos
   */
  async getInvoicesIntegrations(company: Company, integratedModule: string): Promise<ResponseMinimalDTO> {
    const settings = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
    switch (integratedModule) {
      case 'entries':
        const modules = await this.moduleRepository.getModules();

        const filteredModules = [...new Set(settings.map((s) => s.module.id))];

        const foundModules = modules.filter((m) => filteredModules.includes(m.id));

        const integrations = {};
        for (const f of foundModules) {
          const values = settings
            .filter((s) => filteredModules.includes(s.module.id))
            .map((s) => {
              return {
                metaKey: s.metaKey,
                metaValue: s.metaValue,
              };
            });

          const data = {};
          for (const v of values) {
            if (
              v.metaKey == 'registerService' ||
              v.metaKey == 'activeIntegration' ||
              v.metaKey == 'automaticIntegration'
            ) {
              data[v.metaKey] = v.metaValue == 'true' ? true : false;
            } else if (v.metaKey == 'recurrencyFrecuency') {
              data[v.metaKey] = parseInt(v.metaValue);
            } else {
              data[v.metaKey] = v.metaValue;
            }
          }

          integrations[f.shortName] = data;
        }
        return Object.keys(integrations).length > 0
          ? integrations
          : {
              entries: {
                cashPaymentAccountingCatalog: null,
                automaticIntegration: false,
                activeIntegration: false,
                registerService: false,
                recurrencyFrecuency: null,
              },
            };
    }
  }

  /**
   * Metodo utilizado para estructutrear la data necesaria para creear o actulizar los registros en configuraciones
   * de intgraciones con otros modulos
   * @param company compañia con la que esta logado el ususario que invoca el metodo
   * @param data Campos requeridos para crear las configuraciones necesarias
   * @param integratedModule modulo al que se desean guarar configuraciones
   * @returns Retorna el mensaje de exito o error notificando cualquiera de los casos
   */
  async upsertInvoicesIntegrations(
    company: Company,
    data: Partial<InvoiceIntegrationBaseDTO>,
    integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    let settings = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
    const setting = [];

    switch (integratedModule) {
      case 'entries':
        await this.invoicesEntriesRecurrencyRepository.getRecurrency(data.recurrencyFrecuency as number);

        await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.cashPaymentAccountingCatalog, company);
        settings = settings.filter((s) => s.module.id == 'a98b98e6-b2d5-42a3-853d-9516f64eade8');
        const activeIntegration = settings.find((s) => s.metaKey == 'activeIntegration');
        if (activeIntegration ? activeIntegration.metaValue == 'false' : true) {
          throw new BadRequestException(
            'No se pueden actulizar las configuraciones, porque esta se encuentra inactiva.',
          );
        }
        const cashPaymentAccountingCatalog = settings.find((s) => s.metaKey == 'cashPaymentAccountingCatalog');
        const automaticIntegration = settings.find((s) => s.metaKey == 'automaticIntegration');
        const registerService = settings.find((s) => s.metaKey == 'registerService');
        const recurrencyFrecuency = settings.find((s) => s.metaKey == 'recurrencyFrecuency');
        const recurrencyOption = settings.find((s) => s.metaKey == 'recurrencyOption');

        if (!cashPaymentAccountingCatalog) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'cashPaymentAccountingCatalog',
            metaValue: data.cashPaymentAccountingCatalog,
          });
        } else {
          setting.push({ ...cashPaymentAccountingCatalog, metaValue: data.cashPaymentAccountingCatalog });
        }

        if (!automaticIntegration) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'automaticIntegration',
            metaValue: `${data.automaticIntegration}`,
          });
        } else {
          setting.push({ ...automaticIntegration, metaValue: `${data.automaticIntegration}` });
        }
        if (!registerService) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'registerService',
            metaValue: `${data.registerService}`,
          });
        } else {
          setting.push({ ...registerService, metaValue: `${data.registerService}` });
        }
        if (!recurrencyFrecuency) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'recurrencyFrecuency',
            metaValue: `${data.recurrencyFrecuency}`,
          });
        } else {
          setting.push({ ...recurrencyFrecuency, metaValue: `${data.recurrencyFrecuency}` });
        }
        if (!recurrencyOption) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'recurrencyOption',
            metaValue: data.recurrencyOption,
          });
        } else {
          setting.push({ ...recurrencyOption, metaValue: data.recurrencyOption });
        }
        break;
    }

    await this.invoicesIntegrationsRepository.upsertInvoicesIntegrations(setting);
    return {
      message: 'La integración ha sido actualizada correctamente.',
    };
  }

  async updateInvoicesIntegrationsActive(
    company: Company,
    data: Partial<InvoiceIntegrationBaseDTO>,
    integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    const settings = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
    const setting = [];

    switch (integratedModule) {
      case 'entries':
        await this.invoicesEntriesRecurrencyRepository.getRecurrency(data.recurrencyFrecuency as number);

        const activeIntegration = settings.find(
          (s) => s.metaKey == 'activeIntegration' && s.module.id == 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
        );
        if (!activeIntegration) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'activeIntegration',
            metaValue: 'true',
          });
        } else {
          setting.push({ ...activeIntegration, metaValue: `${data.activeIntegration}` });
        }

        break;
    }

    await this.invoicesIntegrationsRepository.upsertInvoicesIntegrations(setting);
    return {
      message: 'La integración ha sido actualizada correctamente.',
    };
  }
}

@Dependencies(InvoicesIntegrationsService)
export class InvoicesIntegrationsDependendService {
  constructor(invoicesIntegrationsService) {
    invoicesIntegrationsService = invoicesIntegrationsService;
  }
}
