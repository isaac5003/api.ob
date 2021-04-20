import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from 'src/companies/entities/Company.entity';
import { AccountignCatalogIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { serviceDataDTO } from 'src/services/dtos/service-data.dto';
import { FilterDTO } from 'src/_dtos/filter.dto';
import {
  ResponseListDTO,
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
import { AccountingEntry } from './entities/AccountingEntry.entity';
import { EntriesFilterDTO } from './dtos/entries-filter.dto';
import { AccountingEntryDetailRepository } from './repositories/AccountingEntryDetail.repository';
import { format } from 'date-fns';
import { allowedNodeEnvironmentFlags } from 'node:process';
import { EntryDataDTO } from './dtos/entries-data.dto';
import { EntryHeaderCreateDTO } from './dtos/entries-header-create.dto';
import { EntryHeaderDataDTO } from './dtos/entries-entry-header-create.dto';
import { EntryDetailsDTO } from './dtos/entries-details-create.dto';

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

    @InjectRepository(AccountingEntryDetailRepository)
    private accountingEntryDetailRepository: AccountingEntryDetailRepository,
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
    return await this.accountingEntryRepository.getSeries(company, data);
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

  async getEntries(
    company: Company,
    filter: EntriesFilterDTO,
  ): Promise<ResponseListDTO<AccountingEntry>> {
    const entries = await this.accountingEntryRepository.getEntries(
      company,
      filter,
    );

    // for (const entry of entries) {
    //   const details = await this.accountingEntryDetailRepository.getDetails(
    //     entry.id,
    //   );

    //   entry.cargo = details.reduce((a, b) => a + b.cargo, 0);
    // }
    return new ResponseListDTO(plainToClass(AccountingEntry, entries));
  }

  async getEntry(
    company: Company,
    id: string,
  ): Promise<ResponseSingleDTO<AccountingEntry>> {
    const entry = await this.accountingEntryRepository.getEntry(company, id);

    const entrie = {
      ...entry,
      rawDate: entry.date,
      date: format(new Date(entry.date), 'dd/MM/yyyy'),
      accountingEntryDetails: entry.accountingEntryDetails
        .sort((a, b) => {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        })
        .map((aed) => {
          delete aed.accountingCatalog.description,
            delete aed.accountingCatalog.level;
          delete aed.accountingCatalog.isParent;
          delete aed.accountingCatalog.isAcreedora;
          delete aed.accountingCatalog.isBalance;

          return {
            ...aed,
          };
        }),
    };

    return new ResponseSingleDTO(plainToClass(AccountingEntry, entrie));
  }

  async createUpdateEntry(
    company: Company,
    header: any,
    details: EntryDetailsDTO[],
    type: string,
    id?: string,
  ): Promise<ResponseMinimalDTO> {
    let message = '';
    const { nextSerie } = await this.accountingEntryRepository.getSeries(
      company,
      {
        accountingEntryType: header.accountingEntryType,
        date: header.date,
      },
    );

    if (header.serie != nextSerie) {
      message = `El numero de serie asignado fué: ${nextSerie}`;
    }

    const entryType = await this.accountingEntryTypeRepository.getEntryType(
      company,
      header.accountingEntryType,
    );

    let headerInsert = {};
    headerInsert = {
      serie: nextSerie,
      title: header.title,
      date: header.date,
      squared: header.squared,
      accounted: header.accounted,
      accountingEntryType: entryType,
      company: company,
    };

    if (id) {
      const entry = await this.accountingEntryRepository.getEntry(company, id);

      headerInsert = {
        ...headerInsert,
        id: entry.id,
      };

      const deleteEntry = await this.accountingEntryDetailRepository.deleteEntryDetail(
        entry.accountingEntryDetails.map((e) => e.id),
      );
    }

    const entryHeader = await this.accountingEntryRepository.createUpdateEntry(
      headerInsert,
      type,
    );

    const detailsInsert = [];
    for (const detail of details) {
      const catalog = await this.accountingCatalogRepository.getAccountingCatalog(
        detail.accountingCatalog,
        company,
        false,
      );

      detailsInsert.push({
        ...detail,
        catalogName: catalog.name,
        accountingCatalog: catalog,
        accountingEntry: entryHeader.id,
        company: company,
      });
    }

    await this.accountingEntryDetailRepository.createEntryDetails(
      detailsInsert,
    );
    return {
      id: entryHeader.id,
      message:
        type == 'create'
          ? `La partida contable ha sido registrada correctamente. ${message}`
          : `La partida contable ha sido actualizada correctamente.`,
    };
  }
}
