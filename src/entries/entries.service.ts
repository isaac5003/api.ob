import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from 'src/companies/entities/Company.entity';
import { AccountignCatalogIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { serviceDataDTO } from 'src/services/dtos/service-data.dto';
import { FilterDTO } from 'src/_dtos/filter.dto';
import {
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { AccountsDTO } from './dtos/entries-account.dto';
import { AccountingCreateDTO } from './dtos/entries-accountingcatalog-create.dto';
import { SeriesDTO } from './dtos/entries-series.dto';
import { SettingGeneralDTO } from './dtos/entries-setting-general.dto';
import { AccountingCatalog } from './entities/AccountingCatalog.entity';
import { AccountingEntryType } from './entities/AccountingEntryType.entity';
import { AccountingRegisterType } from './entities/AccountingRegisterType.entity';
import { AccountingSetting } from './entities/AccountingSetting.entity';
import { AccountingCatalogRepository } from './repositories/AccountingCatalog.repository';
import { AccountingEntryRepository } from './repositories/AccountingEntry.repository';
import { AccountingEntryTypeRepository } from './repositories/AccountingEntryType.repository';
import { AccountingRegisterTypeRepository } from './repositories/AccountingRegisterType.repository';
import { AccountingSettingRepository } from './repositories/AccountingSetting.repository';
import { parseISO, differenceInMonths } from 'date-fns';
import { SettingSignaturesDTO } from './dtos/entries-setting-signatures.dto';
import { SettingIntegrationsDTO } from './dtos/entries-setting-integration.dto';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    @InjectRepository(AccountingEntryTypeRepository)
    private accountingEntryTypeRepository: AccountingEntryTypeRepository,

    @InjectRepository(AccountingEntryRepository)
    private accountingEntryRepository: AccountingEntryRepository,

    @InjectRepository(AccountingRegisterTypeRepository)
    private accountingRegisterTypeRepository: AccountingRegisterTypeRepository,

    @InjectRepository(AccountingSettingRepository)
    private accountingSettingRepository: AccountingSettingRepository,
  ) {}

  async getAccountingCatalogs(
    company: Company,
    filter: FilterDTO,
  ): Promise<AccountingCatalog[]> {
    const catalog = await this.accountingCatalogRepository.getAccountingCatalogs(
      company,
      filter,
    );
    let accounts = [];
    accounts = catalog
      .map((c) => {
        return {
          ...c,
          subAccounts: c.accountingCatalogs.length > 0 ? true : false,
        };
      })
      .map((ct) => {
        delete ct.accountingCatalogs;
        return {
          ...ct,
        };
      });

    return accounts;
  }

  async createAccount(
    accounts: AccountingCreateDTO[],
    parentsCatalog: string,
    company: Company,
  ): Promise<ResponseMinimalDTO> {
    let parent;

    const account = await this.accountingCatalogRepository.createAccounts(
      { accounts, parentsCatalog },
      company,
    );

    if (parentsCatalog) {
      parent = await this.accountingCatalogRepository.getAccountingCatalog(
        parentsCatalog,
        company,
        false,
      );

      const data = {
        ...parent,
        isParent: true,
      };

      await this.accountingCatalogRepository.updateAccount(
        parentsCatalog,
        data,
        company,
      );
    }

    return {
      id: `'${account.map((a) => a.id).join("','")}'`,
      message: 'La(s) cuenta(s) contable(s) se ha creado correctamente.',
    };
  }

  async updateAccountingCatalog(
    id: string,
    company: Company,
    data: any,
  ): Promise<ResponseMinimalDTO> {
    let message = '';
    const account = await this.accountingCatalogRepository.getAccountingCatalog(
      id,
      company,
      true,
    );
    let { code } = data;
    const { name, description, isAcreedora, isBalance } = data;

    const updateData = { name, description, isAcreedora, isBalance };

    if (!account.isParent) {
      data['code'] = code;
    } else {
      (message = 'El codigo no se cambio ya que otras cuentas dependen de él.'),
        (code = account.code);
    }

    await this.accountingCatalogRepository.updateAccount(
      id,
      { name, description, isAcreedora, isBalance },
      company,
    );

    return {
      message: `La cuenta contable ha sido actualizada correctamente. ${message}`,
    };
  }

  async deleteAccount(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    const account = await this.accountingCatalogRepository.getAccountingCatalog(
      id,
      company,
      false,
    );

    if (account.isParent) {
      throw new BadRequestException(
        'No se puede eliminar la cuenta contable ya que tiene subcuentas asignadas a ella',
      );
    }
    const result = await this.accountingCatalogRepository.deleteAccount(
      company,
      account,
    );
    return {
      message: result
        ? 'Se ha eliminado la cuenta contable correctamente'
        : 'No se ha podido eliminar la cuenta contable',
    };
  }

  async getEntryTypes(company: Company): Promise<AccountingEntryType[]> {
    return await this.accountingEntryTypeRepository.getEntryTypes(company);
  }

  async getSeries(
    company: Company,
    data: SeriesDTO,
  ): Promise<ResponseMinimalDTO> {
    const series = await this.accountingEntryRepository.getSeries(
      company,
      data,
    );

    const currentEntries = series
      .map((e) => parseInt(e.serie))
      .sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });

    return {
      nextSerie: currentEntries.length > 0 ? currentEntries[0] + 1 : 1,
    };
  }

  async getResgisterType(company: Company): Promise<AccountingRegisterType[]> {
    return await this.accountingRegisterTypeRepository.getResgisterType(
      company,
    );
  }

  async getSettings(
    company: Company,
    settingType: string,
  ): Promise<ResponseSingleDTO<AccountingSetting>> {
    const settings = await this.accountingSettingRepository.getSetting(
      company,
      settingType,
    );
    let setting = {};
    switch (settingType) {
      case 'general':
        setting = {
          periodStart: settings.periodStart,
          periodEnd: settings.peridoEnd,
        };
        break;
      case 'firmantes':
        setting = {
          legal: settings.legal,
          accountant: settings.accountant,
          auditor: settings.auditor,
        };
        break;
      case 'balance-general':
        setting = {
          balanceGeneral: settings.balanceGeneral
            ? JSON.parse(settings.balanceGeneral)
            : null,
        };
        break;
      case 'estado-resultados':
        setting = {
          estadoResultados: settings.estadoResultados
            ? JSON.parse(settings.estadoResultados)
            : null,
        };
        break;
      case 'integraciones':
        setting = {
          catalog: settings.accountingCatalog
            ? settings.accountingCatalog.id
            : null,
          registerType: settings.registerType ? settings.registerType.id : null,
        };
        break;
    }
    return new ResponseSingleDTO(plainToClass(AccountingSetting, setting));
  }

  async updateSettingGeneral(
    company: Company,
    data: SettingGeneralDTO,
    settingType: string,
  ): Promise<ResponseMinimalDTO> {
    const { peridoEnd, periodStart } = data;
    if (parseISO(peridoEnd) < parseISO(periodStart)) {
      throw new BadRequestException(
        'La fecha final no puede ser menor que la fecha inicial',
      );
    }

    if (
      differenceInMonths(parseISO(peridoEnd), parseISO(periodStart)) + 1 !=
      12
    ) {
      throw new BadRequestException(
        'El periodo fiscal debe  contener 12 meses exactos',
      );
    }

    const settingGeneral = await this.getSettings(company, settingType);
    if (settingGeneral) {
      await this.accountingSettingRepository.updateSetting(
        company,
        { periodStart, peridoEnd },
        settingType,
      );

      return {
        message:
          'Configuracion general del modulo de contabilidad actualizada correctamente.',
      };
    }
  }

  async updateSettingSignatures(
    company: Company,
    data: SettingSignaturesDTO,
    settingType: string,
  ): Promise<ResponseMinimalDTO> {
    const setting = await this.accountingSettingRepository.getSetting(
      company,
      settingType,
    );

    if (setting) {
      await this.accountingSettingRepository.updateSetting(
        company,
        data,
        settingType,
      );

      return {
        message:
          'Configuracion de los firmantes del modulo de contabilidad actualizada correctamente.',
      };
    }
  }

  async updateSettingIntegrations(
    company: Company,
    data: SettingIntegrationsDTO,
    settingType: string,
  ): Promise<ResponseMinimalDTO> {
    const account = await this.accountingCatalogRepository.getAccountingCatalogNotUsed(
      data.accountingCatalog,
      company,
    );
    console.log(account);

    return {
      message: 'hola',
    };
  }
}
