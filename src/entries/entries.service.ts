import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from '../companies/entities/Company.entity';

import { FilterDTO } from '../_dtos/filter.dto';
import { ReportsEntriesDTO, ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { AccountingCreateDTO } from './dtos/accounting-catalog/entries-accountingcatalog-create.dto';
import { EstadoBalanceDTO } from './dtos/settings/entries-balanceestado-setting.vdto';
import { SettingGeneralDTO } from './dtos/settings/entries-setting-general.vdto';
import { SeriesDTO } from './dtos/serie/entries-series.dto';
import { AccountingCatalog } from './entities/AccountingCatalog.entity';
import { AccountingEntryType } from './entities/AccountingEntryType.entity';
import { AccountingSetting } from './entities/AccountingSetting.entity';
import { AccountingCatalogRepository } from './repositories/AccountingCatalog.repository';
import { AccountingEntryRepository } from './repositories/AccountingEntry.repository';
import { AccountingEntryTypeRepository } from './repositories/AccountingEntryType.repository';
import { AccountingSettingRepository } from './repositories/AccountingSetting.repository';
import { parseISO, differenceInMonths } from 'date-fns';
import { SettingSignaturesDTO } from './dtos/settings/entries-setting-signatures.vdto';
import { AccountingEntry } from './entities/AccountingEntry.entity';
import { EntriesFilterDTO } from './dtos/entries-filter.dto';
import { AccountingEntryDetailRepository } from './repositories/AccountingEntryDetail.repository';
import { format, endOfMonth, startOfMonth } from 'date-fns';
import { EntryDetailsDTO } from './dtos/entry-details/entries-details-create.dto';
import { es } from 'date-fns/locale';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    @InjectRepository(AccountingEntryTypeRepository)
    private accountingEntryTypeRepository: AccountingEntryTypeRepository,

    @InjectRepository(AccountingEntryRepository)
    private accountingEntryRepository: AccountingEntryRepository,

    @InjectRepository(AccountingSettingRepository)
    private accountingSettingRepository: AccountingSettingRepository,

    @InjectRepository(AccountingEntryDetailRepository)
    private accountingEntryDetailRepository: AccountingEntryDetailRepository,
  ) {}

  async getAccountingCatalogs(
    company: Company,
    filter: FilterDTO,
  ): Promise<{ data: AccountingCatalog[]; count: number }> {
    const { data, count } = await this.accountingCatalogRepository.getAccountingCatalogs(company, filter);

    let accounts = [];
    accounts = data
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

    return { data: accounts, count };
  }

  async generateReportEntry(company: Company, id: string): Promise<ReportsEntriesDTO> {
    const entry = await this.accountingEntryRepository.getEntry(company, id);
    const report = {
      company: { name: company.name, nit: company.nit, nrc: company.nrc },
      entry,
    };

    return report;
  }

  async createAccount(
    accounts: AccountingCreateDTO[],
    parentCatalog: string,
    company: Company,
  ): Promise<ResponseMinimalDTO> {
    let parent;

    const accountsExist = await this.accountingCatalogRepository.getAccountingCatalogsReport(company);
    const accountsCodes = accountsExist.map((ae) => ae.code);

    for (const account of accounts) {
      if (accountsCodes.includes(account.code)) {
        throw new BadRequestException(
          'No pueden existir códigos duplicados entres las nuevas cuentas y las ya existentes.',
        );
      }
    }

    const account = await this.accountingCatalogRepository.createAccounts({ accounts, parentCatalog }, company);

    if (parentCatalog) {
      parent = await this.accountingCatalogRepository.getAccountingCatalog(parentCatalog, company, false);

      const data = {
        ...parent,
        isParent: true,
      };

      await this.accountingCatalogRepository.updateAccount(parentCatalog, data, company);
    }

    return {
      ids: account.map((a) => a.id),
      message: 'La(s) cuenta(s) contable(s) se ha creado correctamente.',
    };
  }

  async updateAccountingCatalog(id: string, company: Company, data: any): Promise<ResponseMinimalDTO> {
    let message = '';
    const account = await this.accountingCatalogRepository.getAccountingCatalog(id, company, true);
    let { code } = data;
    const { name, description, isAcreedora, isBalance } = data;

    if (!account.isParent) {
      data['code'] = code;
    } else {
      (message = 'El codigo no se cambio ya que otras cuentas dependen de él.'), (code = account.code);
    }

    await this.accountingCatalogRepository.updateAccount(id, { name, description, isAcreedora, isBalance }, company);

    return {
      message: `La cuenta contable ha sido actualizada correctamente. ${message}`,
    };
  }

  async deleteAccount(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const account = await this.accountingCatalogRepository.getAccountingCatalog(id, company, false);

    if (account.isParent) {
      throw new BadRequestException('No se puede eliminar la cuenta contable ya que tiene subcuentas asignadas a ella');
    }
    const result = await this.accountingCatalogRepository.deleteAccount(company, account);
    return {
      message: result
        ? 'Se ha eliminado la cuenta contable correctamente'
        : 'No se ha podido eliminar la cuenta contable',
    };
  }

  async getEntryTypes(company: Company): Promise<{ data: AccountingEntryType[]; count: number }> {
    return this.accountingEntryTypeRepository.getEntryTypes(company);
  }

  async getSeries(company: Company, data: SeriesDTO): Promise<ResponseMinimalDTO> {
    return await this.accountingEntryRepository.getSeries(company, data);
  }

  /**
   *
   * @param company compañia en la que esta logado el usuario que hace la peticion
   * @param settingType --Tipo de configuracón que se desea obtener
   * @returns --Retorna un objeto con las propiedad periodStart, periodEnd, accountinCreditCatalog, accountingDebitCatalog
   */
  async getSettings(company: Company, settingType: string): Promise<ResponseSingleDTO<AccountingSetting>> {
    const settings = await this.accountingSettingRepository.getSetting(company, settingType);
    let setting = {};
    switch (settingType) {
      case 'general':
        setting = {
          periodStart: settings ? settings.periodStart : '',
          periodEnd: settings ? settings.peridoEnd : '',
          accountingDebitCatalog: settings
            ? settings.accountingDebitCatalog
              ? settings.accountingDebitCatalog.id
              : null
            : 'null',
          accountingCreditCatalog: settings
            ? settings.accountingCreditCatalog
              ? settings.accountingCreditCatalog.id
              : null
            : 'null',
        };
        break;
      case 'firmantes':
        setting = {
          legal: settings ? settings.legal : '',
          accountant: settings ? settings.accountant : '',
          auditor: settings ? settings.auditor : '',
        };
        break;
      case 'balance-general':
        setting = {
          balanceGeneral: settings ? (settings.balanceGeneral ? settings.balanceGeneral : null) : null,
        };
        break;
      case 'estado-resultados':
        setting = {
          estadoResultados: settings ? (settings.estadoResultados ? settings.estadoResultados : null) : null,
        };
        break;
    }
    return new ResponseSingleDTO(plainToClass(AccountingSetting, setting));
  }

  /**
   *
   * @param company --Compañia desde la esta logado el usuario que hace la peticion
   * @param data --Datos requeridos para el correcto procesamientos y funcionamiento
   * @param settingType --Tipo de configuracion que se desea actulizar o crear
   * @returns un mensaje notificando que se creo correctamente
   * Es utilizado para actulizar o guardar la data de configuraciones generales de un usuario
   */
  async updateSettingGeneral(
    company: Company,
    data: SettingGeneralDTO,
    settingType: string,
  ): Promise<ResponseMinimalDTO> {
    const { peridoEnd, periodStart, accountingCreditCatalog, accountingDebitCatalog } = data;

    if (parseISO(peridoEnd) < parseISO(periodStart)) {
      throw new BadRequestException('La fecha final no puede ser menor que la fecha inicial');
    }

    if (differenceInMonths(parseISO(peridoEnd), parseISO(periodStart)) + 1 != 12) {
      throw new BadRequestException('El periodo fiscal debe  contener 12 meses exactos');
    }

    const settingGeneral = await this.accountingSettingRepository.getSetting(company, settingType);

    if (settingGeneral) {
      await this.accountingSettingRepository.updateSetting(
        company,
        { periodStart, peridoEnd, accountingCreditCatalog, accountingDebitCatalog },
        settingType,
        'update',
        settingGeneral.id,
      );

      return {
        message: 'Configuracion general del modulo de contabilidad actualizada correctamente.',
      };
    }
    await this.accountingSettingRepository.updateSetting(
      company,
      { periodStart, peridoEnd, accountingDebitCatalog, accountingCreditCatalog },
      settingType,
      'create',
    );
    return {
      message: 'Configuracion general del modulo de contabilidad creada correctamente.',
    };
  }

  async updateSettingSignatures(
    company: Company,
    data: SettingSignaturesDTO,
    settingType: string,
  ): Promise<ResponseMinimalDTO> {
    const setting = await this.accountingSettingRepository.getSetting(company, settingType);

    if (setting) {
      await this.accountingSettingRepository.updateSetting(company, data, settingType, 'update', setting.id);

      return {
        message: 'Configuracion de los firmantes del modulo de contabilidad actualizada correctamente.',
      };
    }
    await this.accountingSettingRepository.updateSetting(company, data, settingType, 'create');

    return {
      message: 'Configuracion de los firmantes del modulo de contabilidad creada correctamente.',
    };
  }

  async updateBalanceSettings(
    company: Company,
    data: EstadoBalanceDTO,
    settingType: string,
    type: string,
  ): Promise<ResponseMinimalDTO> {
    const setting = await this.accountingSettingRepository.getSetting(company, settingType);
    let settings;
    switch (type) {
      case 'balance-general':
        settings = { balanceGeneral: data.settings };
        break;
      case 'estado-resultados':
        settings = { estadoResultados: data.settings };
        break;
    }

    if (setting) {
      await this.accountingSettingRepository.updateSetting(company, settings, settingType, 'update', setting.id);

      return {
        message: 'Los datos de integración han sido actualizados correctamente.',
      };
    }
    await this.accountingSettingRepository.updateSetting(company, settings, settingType, 'create');

    return {
      message: 'Los datos de integración han sido creados correctamente.',
    };
  }

  async getReport(company: Company, data: any, reportType: string): Promise<any> {
    let rangeDetails = [];
    let previousDetails = [];

    switch (reportType) {
      case 'diarioMayor':
      case 'auxiliares':
      case 'balanceComprobacion':
        rangeDetails = await this.accountingEntryDetailRepository.getDetailsForReport(
          company,
          {
            startDate: startOfMonth(parseISO(data.date)),
            endDate: endOfMonth(parseISO(data.date)),
          },
          'rangeDetails',
        );

        rangeDetails = rangeDetails.filter((a) => a.accountingEntry.accounted);

        previousDetails = await this.accountingEntryDetailRepository.getDetailsForReport(
          company,
          {
            startDate: startOfMonth(parseISO(data.date)),
          },
          'previousDetail',
        );

        previousDetails = previousDetails.filter((a) => a.accountingEntry.accounted);
        break;

      case 'accountMovements':
        rangeDetails = await this.accountingEntryDetailRepository.getDetailsForReport(
          company,
          {
            startDate: data.startDate,
            endDate: data.endDate,
            selectedAccounts: data.selectedAccounts,
          },
          'rangeDetails',
        );

        rangeDetails = rangeDetails.filter((a) => a.accountingEntry.accounted);

        previousDetails = await this.accountingEntryDetailRepository.getDetailsForReport(
          company,
          {
            startDate: data.startDate,
            selectedAccounts: data.selectedAccounts,
          },
          'previousDetail',
        );

        previousDetails = previousDetails.filter((a) => a.accountingEntry.accounted);

        break;
      case 'balance-general':
      case 'estado-resultados':
        rangeDetails = await this.accountingEntryDetailRepository.getDetailsForReport(
          company,
          {
            startDate: data.startDate ? data.startDate : null,
            endDate: data.endDate,
          },
          'rangeDetails',
        );

        rangeDetails = rangeDetails.filter((a) => a.accountingEntry.accounted);

        break;
    }

    const signatures = await this.getSettings(company, 'firmantes');

    const catalog = await this.accountingCatalogRepository.getAccountingCatalogsReport(company);

    // define el listado de cuentas contables afectadas en el periodo seleccionado
    let affectedCatalog = [];

    let accounts = [];
    let name = '';

    switch (reportType) {
      case 'diarioMayor':
        affectedCatalog = [...new Set(rangeDetails.map((d) => d.accountingCatalog.code))];
        // obtiene el saldo inicial por cuenta

        accounts = affectedCatalog
          .map((c) => {
            const account = catalog.find((ct) => ct.code == c);
            const abono = previousDetails
              .filter((d) => d.accountingCatalog.code == c)
              .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
            const cargo = previousDetails
              .filter((d) => d.accountingCatalog.code == c)
              .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
            const applicable = rangeDetails.filter((d) => d.accountingCatalog.code == c);
            const movements = [];
            for (const item of applicable) {
              const found = movements.find((m) => m.date == item.accountingEntry.date);
              if (found) {
                found.cargo = found.cargo + (item.cargo ? item.cargo : 0);
                found.abono = found.abono + (item.abono ? item.abono : 0);
              } else {
                movements.push({
                  date: item.accountingEntry.date,
                  cargo: item.cargo ? item.cargo : 0,
                  abono: item.abono ? item.abono : 0,
                  balance: 0,
                });
              }
            }
            const initialBalance = account.isAcreedora ? abono - cargo : cargo - abono;
            let currentBalance = initialBalance;
            return {
              code: c,
              name: account.name,
              initialBalance: parseFloat(initialBalance.toFixed(2)),
              movements: movements
                .sort((a, b) => {
                  if (new Date(a.date) > new Date(b.date)) return 1;
                  if (new Date(a.date) < new Date(b.date)) return -1;
                  return 0;
                })
                .map((m) => {
                  currentBalance = parseFloat(
                    (currentBalance + (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)).toFixed(2),
                  );
                  return {
                    ...m,
                    date: format(new Date(m.date), 'dd/MM/yyyy'),
                    balance: currentBalance,
                  };
                }),
              totalAbono: movements.reduce((a, b) => a + b.abono, 0),
              totalCargo: movements.reduce((a, b) => a + b.cargo, 0),
              currentBalance,
            };
          })
          .sort((a, b) => {
            if (a.code < b.code) return -1;
            if (a.code > b.code) return 1;
            return 0;
          });

        name = `LIBRO DIARIO MAYOR PARA EL MES DE ${format(parseISO(data.date), 'MMMM yyyy', {
          locale: es,
        }).toUpperCase()}`;
        break;

      case 'auxiliares':
        affectedCatalog = [...new Set(rangeDetails.map((d) => d.accountingCatalog.code))];
        // obtiene el saldo inicial por cuenta
        accounts = affectedCatalog
          .map((c) => {
            const account = catalog.find((ct) => ct.code == c);
            const abono = previousDetails
              .filter((d) => d.accountingCatalog.code == c)
              .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
            const cargo = previousDetails
              .filter((d) => d.accountingCatalog.code == c)
              .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
            const applicable = rangeDetails.filter((d) => d.accountingCatalog.code == c);
            const movements = applicable.map((a) => {
              return {
                entryNumber: `Partida #${a.accountingEntry.serie}`,
                entryName: a.concept,
                date: a.accountingEntry.date,
                cargo: a.cargo ? a.cargo : 0,
                abono: a.abono ? a.abono : 0,
                balance: 0,
              };
            });
            const initialBalance = account.isAcreedora ? abono - cargo : cargo - abono;
            let currentBalance = initialBalance;
            return {
              code: c,
              name: account.name,
              initialBalance: parseFloat(initialBalance.toFixed(2)),
              movements: movements
                .sort((a, b) => {
                  if (new Date(a.date) > new Date(b.date)) return 1;
                  if (new Date(a.date) < new Date(b.date)) return -1;
                  return 0;
                })
                .map((m) => {
                  currentBalance = parseFloat(
                    (currentBalance + (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)).toFixed(2),
                  );
                  return {
                    ...m,
                    date: format(new Date(m.date), 'dd/MM/yyyy'),
                    balance: currentBalance,
                  };
                }),
              totalAbono: movements.reduce((a, b) => a + parseFloat(b.abono), 0),
              totalCargo: movements.reduce((a, b) => a + parseFloat(b.cargo), 0),
              currentBalance,
            };
          })
          .sort((a, b) => {
            if (a.code < b.code) return -1;
            if (a.code > b.code) return 1;
            return 0;
          });

        name = `LIBROS DE AUXILIARES PARA EL MES DE ${format(parseISO(data.date), 'MMMM yyyy', {
          locale: es,
        }).toUpperCase()}`;
        break;

      case 'accountMovements':
        // define el listado de cuentas contables afectadas en el periodo seleccionado
        affectedCatalog = [...new Set(rangeDetails.map((d) => d.accountingCatalog.code))];
        // obtiene el saldo inicial por cuenta
        accounts = affectedCatalog
          .map((c) => {
            const account = catalog.find((ct) => ct.code == c);
            const abono = previousDetails
              .filter((d) => d.accountingCatalog.code == c)
              .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
            const cargo = previousDetails
              .filter((d) => d.accountingCatalog.code == c)
              .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
            const applicable = rangeDetails.filter((d) => d.accountingCatalog.code == c);
            const movements = applicable.map((a) => {
              return {
                entryNumber: `Partida #${a.accountingEntry.serie}`,
                entryName: a.concept,
                date: a.accountingEntry.date,
                cargo: parseFloat(a.cargo ? a.cargo.toFixed(2) : 0),
                abono: parseFloat(a.abono ? a.abono.toFixed(2) : 0),
                balance: 0,
              };
            });
            const initialBalance = account.isAcreedora ? abono - cargo : cargo - abono;
            let currentBalance = initialBalance;
            return {
              code: c,
              name: account.name,
              initialBalance: parseFloat(initialBalance.toFixed(2)),
              movements: movements
                .sort((a, b) => {
                  if (new Date(a.date) > new Date(b.date)) return 1;
                  if (new Date(a.date) < new Date(b.date)) return -1;
                  return 0;
                })
                .map((m) => {
                  currentBalance = parseFloat(
                    (currentBalance + (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)).toFixed(2),
                  );
                  return {
                    ...m,
                    date: format(new Date(m.date), 'dd/MM/yyyy'),
                    balance: currentBalance,
                  };
                }),
              totalAbono: parseFloat(movements.reduce((a, b) => a + b.abono, 0).toFixed(2)),
              totalCargo: parseFloat(movements.reduce((a, b) => a + b.cargo, 0).toFixed(2)),
              currentBalance,
            };
          })
          .sort((a, b) => {
            if (a.code < b.code) return -1;
            if (a.code > b.code) return 1;
            return 0;
          });

        name = `DETALLE DE MOVIMIENTO DE CUENTAS EN EL PERÍODO DEL ${format(
          parseISO(data.startDate),
          'dd/MM/yyyy',
        )} AL ${format(parseISO(data.endDate), 'dd/MM/yyyy')}`;

        break;

      case 'balanceComprobacion':
        affectedCatalog = [...rangeDetails.map((d) => d.accountingCatalog.code)].concat(
          ...previousDetails.map((d) => d.accountingCatalog.code),
        );

        accounts = catalog
          .filter((c) => {
            return affectedCatalog.some((ac) => ac.startsWith(c.code));
          })
          .map((c) => {
            let initialBalance = previousDetails
              .filter((d) => d.accountingCatalog.code.startsWith(c.code))
              .reduce((a, b) => {
                return (
                  a +
                  (b.accountingCatalog.isAcreedora
                    ? (b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)
                    : (b.cargo ? b.cargo : 0) - (b.abono ? b.abono : 0))
                );
              }, 0);
            initialBalance = parseFloat(initialBalance.toFixed(2));
            let cargo = rangeDetails
              .filter((d) => d.accountingCatalog.code.startsWith(c.code))
              .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
            cargo = parseFloat(cargo.toFixed(2));
            let abono = rangeDetails
              .filter((d) => d.accountingCatalog.code.startsWith(c.code))
              .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
            abono = parseFloat(abono.toFixed(2));
            let currentBalance = c.isAcreedora ? abono - cargo : cargo - abono;
            currentBalance = parseFloat(currentBalance.toFixed(2));
            return {
              code: c.code,
              name: c.name,
              initialBalance,
              cargo,
              abono,
              currentBalance,
              actualBalance: initialBalance + currentBalance,
            };
          })
          .sort((a, b) => {
            if (a.code < b.code) return -1;
            if (a.code > b.code) return 1;
            return 0;
          })
          .filter((c) => c.initialBalance > 0 || c.cargo > 0 || c.abono > 0);

        name = `BALANCE DE COMPROBACIÓN AL ${format(endOfMonth(parseISO(data.date)), 'dd - MMMM - yyyy', { locale: es })
          .split('-')
          .join('de')
          .toUpperCase()}`;
        break;

      case 'balance-general':
        const { balanceGeneral } = await this.accountingSettingRepository.getSetting(company, 'balance general');
        if (!balanceGeneral) {
          throw new BadRequestException('No hay configuracion valida guardada para el Balance general.');
        }

        if (Object.values(balanceGeneral.special).filter((v) => v == '').length > 0) {
          throw new BadRequestException(
            'Se deben definir las cuentas de utiliadades y perdidas para el periodo anterior y el actual.',
          );
        }
        accounts = balanceGeneral.report.map((s) => {
          let add = 0;
          let objaccount = {};
          if (s.id == 3) {
            const resacreedora = rangeDetails
              .filter(
                (d) =>
                  (d.accountingCatalog.code.startsWith('4') || d.accountingCatalog.code.startsWith('5')) &&
                  d.accountingCatalog.isAcreedora,
              )
              .reduce(
                (a, b) => {
                  return {
                    cargo: a.cargo + (b.cargo ? b.cargo : 0),
                    abono: a.abono + (b.abono ? b.abono : 0),
                  };
                },
                { cargo: 0, abono: 0 },
              );
            const resdeudora = rangeDetails
              .filter(
                (d) =>
                  (d.accountingCatalog.code.startsWith('4') || d.accountingCatalog.code.startsWith('5')) &&
                  !d.accountingCatalog.isAcreedora,
              )
              .reduce(
                (a, b) => {
                  return {
                    cargo: a.cargo + (b.cargo ? b.cargo : 0),
                    abono: a.abono + (b.abono ? b.abono : 0),
                  };
                },
                { cargo: 0, abono: 0 },
              );
            add = resacreedora.abono + resdeudora.abono - (resacreedora.cargo + resdeudora.cargo);
            const current = catalog.find(
              (c) => c.id == (add >= 0 ? balanceGeneral.special.curre_gain : balanceGeneral.special.curre_lost),
            );
            objaccount = {
              code: current.code,
              name: current.name,
              total: parseFloat(add.toFixed(2)),
            };
          }
          return {
            code: s.id,
            name: s.display,
            total: parseFloat(
              (
                s.children
                  .map((c) => {
                    const totalniveldos = c.children
                      .map((ch) => {
                        const totalniveltres = rangeDetails
                          .filter((d) => d.accountingCatalog.code.startsWith(ch.id))
                          .reduce(
                            (a, b) =>
                              a +
                              (b.accountingCatalog.isAcreedora
                                ? (b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)
                                : (b.cargo ? b.cargo : 0) - (b.abono ? b.abono : 0)),
                            0,
                          );
                        ch.total = totalniveltres;
                        return totalniveltres;
                      })
                      .reduce((a, b) => a + b, 0);
                    c.total = totalniveldos;
                    return totalniveldos;
                  })
                  .reduce((a, b) => a + b, 0) + add
              ).toFixed(2),
            ),
            accounts: s.children.map((c) => {
              const accounts = c.children
                .map((ch) => {
                  return {
                    code: ch.id,
                    name: ch.display,
                    total: parseFloat(ch.total.toFixed(2)),
                  };
                })
                .filter((ch) => ch.total > 0);
              if (s.id == 3) {
                accounts.push(objaccount);
              }
              return {
                code: c.id,
                name: c.display,
                total: parseFloat(c.total.toFixed(2)),
                accounts,
              };
            }),
          };
        });

        name = `BALANCE GENERAL AL ${format(parseISO(data.endDate), 'dd/MM/yyyy')}`;

        break;

      case 'estado-resultados':
        const estadoResultados = await this.accountingSettingRepository.getSetting(company, 'estado de resultado');

        if (!estadoResultados.estadoResultados) {
          throw new BadRequestException('El estado de resultados no se puede generar ya que no ha sido configurado');
        }
        estadoResultados.estadoResultados as any[];
        if (
          !estadoResultados.estadoResultados.map((er) => er.children).filter((erc) => erc != null && erc.length > 0)
        ) {
          throw new BadRequestException(
            'El estado de resultados no se puede generar ya que no tiene cuentas contables asignadas',
          );
        }

        let saldoacumulado = 0;
        accounts = estadoResultados.estadoResultados
          .filter((setting) => setting.show)
          .map((account) => {
            let total = 0;
            if (account.children) {
              total = account.children
                .map((children) => children.id)
                .map((catalogo) =>
                  rangeDetails
                    .filter((d) => d.accountingCatalog.code.startsWith(catalogo))
                    .reduce((a, b) => a + ((b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)), 0),
                )
                .reduce((a, b) => a + b, 0);
              saldoacumulado = saldoacumulado + total;
            } else {
              total = saldoacumulado;
            }

            let children = null;
            if (account.details) {
              children = account.children.map((ch) => {
                return {
                  name: ch.display,
                  total: rangeDetails
                    .filter((detail) => detail.accountingCatalog.code.startsWith(ch.id))
                    .reduce((a, b) => a + ((b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)), 0),
                };
              });
            }

            return {
              name: account.display,
              total: parseFloat(total.toFixed(2)),
              type: !account.children ? 'total' : null,
              children,
            };
          });

        name = `ESTADO DE RESULTADOS AL ${format(parseISO(data.endDate), 'dd/MM/yyyy')}`;
        break;

      case 'accounting-catalog':
        accounts = catalog;
        name = 'CATALOGO DE CUENTAS';
        break;
    }

    return {
      signatures: { ...signatures.data },
      company: { name: company.name, nrc: company.nrc, nit: company.nit },
      name,
      accounts,
    };
  }

  async getEntries(
    company: Company,
    filter: EntriesFilterDTO,
  ): Promise<ResponseListDTO<Partial<AccountingEntry>, number, number, number>> {
    const { data, count } = await this.accountingEntryRepository.getEntries(company, filter);

    const entry = data.map((e) => {
      const entri = {
        ...e,

        cargo: e.cargo,
      };

      return entri;
    });

    return {
      data: entry,
      count,
      page: filter.page,
      limit: filter.limit,
    };
  }

  async getEntry(company: Company, id: string): Promise<ResponseSingleDTO<AccountingEntry>> {
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
          delete aed.accountingCatalog.description, delete aed.accountingCatalog.level;
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
    const { nextSerie } = await this.accountingEntryRepository.getSeries(company, {
      accountingEntryType: header.accountingEntryType,
      date: header.date,
    });

    if (header.serie != nextSerie) {
      message = `El numero de serie asignado fué: ${nextSerie}`;
    }

    const entryType = await this.accountingEntryTypeRepository.getEntryType(company, header.accountingEntryType);

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

    if (id && type == 'update') {
      const entry = await this.accountingEntryRepository.getEntry(company, id);

      headerInsert = {
        ...headerInsert,
        id: entry.id,
      };

      await this.accountingEntryDetailRepository.deleteEntryDetail(entry.accountingEntryDetails.map((e) => e.id));
    }

    const entryHeader = await this.accountingEntryRepository.createUpdateEntry(headerInsert, type);

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

    await this.accountingEntryDetailRepository.createEntryDetails(detailsInsert);
    return {
      id: entryHeader.id,
      message:
        type == 'create'
          ? `La partida contable ha sido registrada correctamente. ${message}`
          : `La partida contable ha sido actualizada correctamente.`,
    };
  }

  async deleteEntry(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const entry = await this.accountingEntryRepository.getEntry(company, id);

    const resultDetails = await this.accountingEntryDetailRepository.deleteEntryDetail(
      entry.accountingEntryDetails.map((e) => {
        return { id: e.id, company };
      }),
    );

    const resultHeader = await this.accountingEntryRepository.deleteEntry(company, id);
    return {
      message:
        resultDetails && resultHeader
          ? 'Se ha eliminado la partida contable correctamente'
          : 'No se ha podido eliminar la partida contable',
    };
  }
}
