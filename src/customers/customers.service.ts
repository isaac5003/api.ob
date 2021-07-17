import { InjectRepository } from '@nestjs/typeorm';
import { AccountignCatalogIntegrationDTO } from './dtos/customer-integration.dto';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';
import { CustomerRepository } from './repositories/Customer.repository';
import { CustomerBranchRepository } from './repositories/CustomerBranch.repository';
import { CustomerStatusDTO } from './dtos/customer-status.dto';
import { CustomerDataDTO } from './dtos/customer-data.dto';
import { plainToClass } from 'class-transformer';
import { CustomerBranch } from './entities/CustomerBranch.entity';
import { CustomerType } from './entities/CustomerType.entity';
import { CustomerTypeRepository } from './repositories/CustomerType.repository';
import { CustomerTaxerType } from './entities/CustomerTaxerType.entity';
import { CustomerTaxerTypeRepository } from './repositories/CustomerTaxerType.repository';
import { CustomerTypeNatural } from './entities/CustomerTypeNatural.entity';
import { CustomerTypeNaturalRepository } from './repositories/CustomerTypeNatural.repository';
import { CustomerIntegrationsRepository } from './repositories/CustomerIntegrations.repository';
import { Company } from '../companies/entities/Company.entity';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProviderStatusDTO } from '../providers/dtos/provider-updateStatus.dto';
import { BranchDataDTO } from './dtos/customer-branch.dto';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ModuleRepository } from 'src/system/repositories/Module.repository';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    @InjectRepository(CustomerBranchRepository)
    private customerBranchRepository: CustomerBranchRepository,

    @InjectRepository(CustomerTaxerTypeRepository)
    private customerTaxerTypeRepository: CustomerTaxerTypeRepository,

    @InjectRepository(CustomerTypeRepository)
    private customerTypeRepository: CustomerTypeRepository,

    @InjectRepository(CustomerTypeNaturalRepository)
    private customerTypeNaturalRepository: CustomerTypeNaturalRepository,

    @InjectRepository(CustomerIntegrationsRepository)
    private customerIntegrationsRepository: CustomerIntegrationsRepository,

    @InjectRepository(ModuleRepository)
    private moduleRepository: ModuleRepository,
  ) {}

  async generateReportGeneral(company: Company, type = 'clientes'): Promise<any> {
    const { data } = await this.customerRepository.getCustomers(company, { branch: true }, type);

    const report = {
      company: {
        name: company.name,
        nrc: company.nrc,
        nit: company.nit,
      },
      name: type == 'clientes' ? 'REPORTE GENERAL DE CLIENTES' : 'REPORTE GENERAL DE PROVEEDORES',
      customers: data
        .map((c) => {
          const phones = c.customerBranches.find((cb) => cb.default).contactInfo.phones;
          return {
            ...c,
            contactName: c.customerBranches.find((cb) => cb.default).contactName,
            contactPhone: phones ? (phones.length > 0 ? phones[0] : '') : '',
          };
        })
        .map((cu) => {
          delete cu.customerBranches, delete cu.shortName, delete cu.isCustomer, delete cu.isProvider;
          return {
            ...cu,
          };
        }),
      providers: data
        .map((c) => {
          const phones = c.customerBranches.find((cb) => cb.default).contactInfo.phones;
          return {
            ...c,
            contactName: c.customerBranches.find((cb) => cb.default).contactName,
            contactPhone: phones ? (phones.length > 0 ? phones[0] : '') : '',
          };
        })
        .map((cu) => {
          delete cu.customerBranches, delete cu.shortName;

          return {
            ...cu,
          };
        }),
    };
    if (type == 'proveedores') {
      delete report.customers;
    } else {
      delete report.providers;
    }
    return report;
  }

  async generateReportIndividual(company: Company, id: string, type = 'cliente'): Promise<any> {
    const customer = await this.customerRepository.getCustomer(id, company, type);
    const phone = customer.customerBranches.find((cb) => cb.default).contactInfo;

    const report = {
      company: {
        name: company.name,
        nrc: company.nrc,
        nit: company.nit,
      },
      name: type == 'cliente' ? 'PERFIL DEL CLIENTE' : 'PERFIL DEL PROVEEDOR',

      customer: {
        ...customer,
        constactName: customer.customerBranches.find((cb) => cb.default).contactName,
        contactPhone: phone ? (phone.phones.length > 0 ? phone.phones[0] : '') : '',
        contactEmail: phone ? (phone.emails.length > 0 ? phone.emails[0] : '') : '',
      },
      provider: {
        ...customer,
        constactName: customer.customerBranches.find((cb) => cb.default).contactName,
        contactPhone: phone ? (phone.phones.length > 0 ? phone.phones[0] : '') : '',
        contactEmail: phone ? (phone.emails.length > 0 ? phone.emails[0] : '') : '',
      },
    };

    if (type == 'proveedor') {
      delete report.customer;
      delete report.provider.isActiveCustomer;
    } else {
      delete report.provider;
      delete report.customer.isActiveProvider;
    }
    return report;
  }

  async getCustomers(
    company: Company,
    data: CustomerFilterDTO,
    type = 'clientes',
  ): Promise<{ data: Customer[]; count: number }> {
    return this.customerRepository.getCustomers(company, data, type);
  }

  async getCustomer(company: Company, id: string, type = 'cliente'): Promise<Customer> {
    const customer = await this.customerRepository.getCustomer(id, company, type);

    if (type == 'proveedor') {
      if (!customer.isProvider) {
        throw new BadRequestException('El proveedor seleccionado no existe.');
      }
    } else {
      if (!customer.isCustomer) {
        throw new BadRequestException('El cliente seleccionado no existe.');
      }
    }
    return customer;
  }
  /**
   * Metodo utilizado para obtener las configuraciones de integraciones individuale de cada cliente o proveedor
   * @param id del cliente o proveedor al que se le desean obtener las configuraciones
   * @param company compañia del usuario que invoica el metodo
   * @param integratedModule modulo del qu ese desean obtener las configuraciones
   * @param type si es cliente o proveedor al que se desean obtener las ocnfiguraciones
   * @returns retorna un objeto con las congiguraciones para ese cliente
   */
  async getCustomerIntegration(
    id: string,
    company: Company,
    integratedModule: string,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    let integrations = {};
    switch (integratedModule) {
      case 'entries':
        const settingsIntegrations = await this.customerRepository.getCustomer(id, company, type, ['ac']);
        if (type == 'cliente') {
          integrations = {
            ...integrations,
            entries: {
              accountingCatalogSales: settingsIntegrations.accountingCatalogSales
                ? settingsIntegrations.accountingCatalogSales.id
                : null,
              accountingCatalogCXC: settingsIntegrations.accountingCatalogCXC
                ? settingsIntegrations.accountingCatalogCXC.id
                : null,
            },
          };
        } else if (type == 'proveedor') {
          integrations = {
            ...integrations,
            entries: {
              accountingCatalogPurchases: settingsIntegrations.accountingCatalogPurchases
                ? settingsIntegrations.accountingCatalogPurchases.id
                : null,
              accountingCatalogCXP: settingsIntegrations.accountingCatalogCXP
                ? settingsIntegrations.accountingCatalogCXP.id
                : null,
            },
          };
        }
        break;
    }
    return integrations;
  }

  /**
   *
   * @param company compañia con la que esta logado el usuario que invoca el emtodo
   * @param integratedModule shortname del modulo del que se desea obtener configuraciones
   * @param type si se estan obteniendo confuguraciones de clientes o de proveedores
   * @returns retorna un objeto con las configuraciones agrupadas por cada modulo
   */
  async getCustomerSettingIntegrations(
    company: Company,
    integratedModule: string,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    const settings = await this.customerIntegrationsRepository.getCustomerIntegrations(company);
    const modules = await this.moduleRepository.getModules();
    const integrations = {};
    switch (integratedModule) {
      case 'entries':
        const filteredModules = [...new Set(settings.map((s) => s.module.id))];

        const foundModules = modules.filter((m) => filteredModules.includes(m.id));

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
            if (type == 'cliente') {
              switch (v.metaKey) {
                case 'accountingCatalogCXC':
                  data[v.metaKey] = v.metaValue;
                  break;
                case 'accountingCatalogSales':
                  data[v.metaKey] = v.metaValue;
                  break;
              }
            } else if (type == 'proveedor') {
              switch (v.metaKey) {
                case 'accountingCatalogCXP':
                  data[v.metaKey] = v.metaValue;
                  break;
                case 'accountingCatalogPurchases':
                  data[v.metaKey] = v.metaValue;
                  break;
              }
            }
          }

          integrations[f.shortName] = data;
        }

        break;
    }
    if (type == 'cliente') {
      return Object.keys(integrations).length > 0 && Object.keys(integrations['entries']).length > 0
        ? integrations
        : { entries: { accountingCatalogCXC: null, accountingCatalogSales: null } };
    } else if (type == 'proveedor') {
      return Object.keys(integrations).length > 0 && Object.keys(integrations['entries']).length > 0
        ? integrations
        : { entries: { accountingCatalogCXP: null, accountingCatalogPurchases: null } };
    }
  }

  /**
   * Metodo utilizado para actulizar o insertas configuraciones de integraciones generales de clientes y proveedores
   * @param company compañia con la que esta logado el usuario que invoca el metodo
   * @param data Campos necesario que se insertaran o actualizaran
   * @param integratedModule shortname del modulo con el que se desean actulizar o insertar configuraciones de intergacion
   * @param type si las integraciones se estan actulizando apra cliente o proveedor
   * @returns mensaje de exito en el caso que asi fuese
   */
  async upsertCustomerSettingsIntegrations(
    company: Company,
    data: AccountignCatalogIntegrationDTO,
    integratedModule: string,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    const settings = await this.customerIntegrationsRepository.getCustomerIntegrations(company);
    const setting = [];

    switch (integratedModule) {
      case 'entries':
        if (type == 'cliente') {
          if (data.accountingCatalogSales) {
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogSales, company);
          }
          if (data.accountingCatalogCXC) {
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogCXC, company);
          }

          const accountingCatalogCXC = settings.find((s) => s.metaKey == 'accountingCatalogCXC');
          const accountingCatalogSales = settings.find((s) => s.metaKey == 'accountingCatalogSales');

          if (!accountingCatalogCXC) {
            // await this.customerIntegrationsRepository.updateCustomerIntegrations(company, data);
            setting.push({
              company: company,
              module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
              metaKey: 'accountingCatalogCXC',
              metaValue: data.accountingCatalogCXC,
            });
          } else {
            setting.push({ ...accountingCatalogCXC, metaValue: data.accountingCatalogCXC });
          }
          if (!accountingCatalogSales) {
            setting.push({
              company: company,
              module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
              metaKey: 'accountingCatalogSales',
              metaValue: data.accountingCatalogSales,
            });
          } else {
            setting.push({ ...accountingCatalogSales, metaValue: data.accountingCatalogSales });
          }
        } else if (type == 'proveedor') {
          if (data.accountingCatalogPurchases) {
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(
              data.accountingCatalogPurchases,
              company,
            );
          }
          if (data.accountingCatalogCXP) {
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogCXP, company);
          }

          const accountingCatalogCXP = settings.find((s) => s.metaKey == 'accountingCatalogCXP');
          const accountingCatalogPurchases = settings.find((s) => s.metaKey == 'accountingCatalogPurchases');

          if (!accountingCatalogCXP) {
            // await this.customerIntegrationsRepository.updateCustomerIntegrations(company, data);
            setting.push({
              company: company,
              module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
              metaKey: 'accountingCatalogCXP',
              metaValue: data.accountingCatalogCXP,
            });
          } else {
            setting.push({ ...accountingCatalogCXP, metaValue: data.accountingCatalogCXP });
          }
          if (!accountingCatalogPurchases) {
            setting.push({
              company: company,
              module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
              metaKey: 'accountingCatalogPurchases',
              metaValue: data.accountingCatalogPurchases,
            });
          } else {
            setting.push({ ...accountingCatalogPurchases, metaValue: data.accountingCatalogPurchases });
          }
        }

        break;
    }

    await this.customerIntegrationsRepository.createCustomerIntegrations(setting);
    return {
      message: 'La integración ha sido actualizada correctamente.',
    };
  }

  async getCustomerTributary(id: string, company: Company, type = 'cliente'): Promise<ResponseSingleDTO<Customer>> {
    const { dui, nit, nrc, giro, customerType, customerTaxerType, customerTypeNatural } =
      await this.customerRepository.getCustomer(id, company, type);
    const tributary = {
      dui,
      nit,
      nrc,
      giro,
      customerType,
      customerTaxerType,
      customerTypeNatural,
    };
    return new ResponseSingleDTO(plainToClass(Customer, tributary));
  }

  async getCustomerBranches(
    id: string,
    filter?: FilterDTO,
    type = 'cliente',
  ): Promise<{ data: CustomerBranch[]; count: number }> {
    return this.customerBranchRepository.getCustomerBranches(id, type, filter);
  }

  async getCustomerBranch(id: string, customer: string, type = 'cliente'): Promise<CustomerBranch> {
    return this.customerBranchRepository.getCustomerCustomerBranch(id, type, customer);
  }

  async createBranches(
    data: BranchDataDTO[],
    customerId: string,
    company: Company,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    const customer = await this.customerRepository.getCustomer(customerId, company, type);
    const branches = data.map((b) => {
      return {
        ...b,
        name: b.name,
        customer: customer.id,
        default: b.default == true || b.default == false ? b.default : false,
      };
    });
    const createdBranches = await this.customerBranchRepository.createBranch(branches, type);
    return {
      ids: createdBranches.map((b) => b.id),
      message: 'Se han creado las sucursales correctamente.',
    };
  }

  async updateBranch(
    id: string,
    data: Partial<BranchDataDTO>,
    customerId: string,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.getCustomerCustomerBranch(id, type, customerId);
    const update = await this.customerBranchRepository.updateBranch(id, data, type);

    return {
      message: update.affected > 0 ? 'La sucursal se actualizo correctamente.' : 'No se pudo actulizar la sucursal.',
    };
  }

  async updateBranchDefault(
    id: string,
    filter: FilterDTO,
    customer: string,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.getCustomerCustomerBranch(id, type, customer);
    const customerBranch = await this.customerBranchRepository.getCustomerBranches(customer, type, filter);

    //marca como defualt:false la antigua branch
    await this.customerBranchRepository.updateBranch(
      customerBranch.data.find((b) => b.default).id,
      { default: false },
      type,
    );

    //marca con default la nueva branch
    await this.customerBranchRepository.updateBranch(id, { default: true }, type);

    return {
      message: 'Se ha marcado como sucursal principal correctamente.',
    };
  }

  async deleteBranch(id: string, customerId: string, type = 'cliente'): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.getCustomerCustomerBranch(id, type, customerId);
    const deletedBranch = await this.customerBranchRepository.deleteBranch(id, type);

    return {
      message: deletedBranch.affected
        ? 'La sucursal se elimino correctamente.'
        : 'La susursal no se ha podidop eliminar.',
    };
  }

  async getCustomerTypes(): Promise<{ data: CustomerType[]; count: number }> {
    return this.customerTypeRepository.getCustomerTypes();
  }

  async getCustomerTaxerTypes(): Promise<{ data: CustomerTaxerType[]; count: number }> {
    return this.customerTaxerTypeRepository.getCustomerTaxerTypes();
  }

  async getCustomerTypeNaturals(): Promise<{ data: CustomerTypeNatural[]; count: number }> {
    return this.customerTypeNaturalRepository.getCustomerTypeNaturals();
  }

  async createCustomer(company: Company, data, type = 'cliente'): Promise<ResponseMinimalDTO> {
    let message = 'Se ha creado el cliente correctamente';

    if (type == 'proveedor') {
      data = {
        ...data,
        isProvider: true,
        isActiveProvider: true,
        isCustomer: data.isCustomer ? data.isCustomer : false,
        isActiveCustomer: data.isCustomer ? data.isCustomer : false,
      };

      message = 'Se ha creado el proveedor correctamente';
    } else {
      data = {
        ...data,
        isCustomer: true,
        isProvider: data.isProvider ? data.isProvider : false,
        isActiveCustomer: true,
        isActiveProvider: data.isProvider ? data.isProvider : false,
      };
    }

    const customer = await this.customerRepository.createCustomer(company, data, type);
    const { id } = customer;
    const branch = {
      ...data.branch,
      name: data.branch.name ? data.branch.name : 'Sucursal principal',
      customer: id,
    };
    await this.customerBranchRepository.createBranch([branch], type);
    return {
      id: customer.id,
      message,
    };
  }

  async updateCustomer(
    id: string,
    data: CustomerDataDTO,
    company: Company,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.updateBranch(id, data.branch, type);
    delete data.branch;
    await this.customerRepository.getCustomer(id, company, type);
    const updated = await this.customerRepository.updateCustomer(id, data, company, type);

    if (updated.affected == 0) {
      throw new BadRequestException(`No se ha podido actulizar el ${type} seleccionado.`);
    }

    return {
      message: type == 'cliente' ? 'El cliente se actualizo correctamente' : 'El proveedor se actualizo correctamente',
    };
  }

  async UpdateStatusCustomer(
    id: string,
    data: Partial<CustomerStatusDTO> | Partial<ProviderStatusDTO>,
    company: Company,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    await this.customerRepository.updateCustomer(id, data, company, type);
    return {
      message: type == 'cliente' ? 'El cliente se actualizo correctamente' : 'El proveedor se actualizo correctamente',
    };
  }

  /**
   * Metodo utilizado para actualizar las configuraciones de integracion de clientes y proveedores individualmente
   * @param id del cliente o proveedor al que se desean actulizar las configuraciones de integraciones
   * @param data Campos necesarios o campos que se estan mandando a actulizar
   * @param company compañia con la que esta logado el usuario que invoca el metdo
   * @param integratedModule 'Modulo al que se le desean actulizar las configuraciones
   * @param type que configuraciones se estan actulizando, cliente o proveedor
   * @returns Mensaje de exito
   */
  async UpdateCustomerIntegration(
    id: string,
    data: AccountignCatalogIntegrationDTO,
    company: Company,
    integratedModule: string,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    await this.customerRepository.getCustomer(id, company, type);
    switch (integratedModule) {
      case 'entries':
        if (type == 'cliente') {
          if (data.accountingCatalogCXC && data.accountingCatalogSales) {
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogCXC, company);
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogSales, company);
          }
        } else if (type == 'proveedor') {
          if (data.accountingCatalogCXP && data.accountingCatalogPurchases) {
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogCXP, company);
            await this.accountingCatalogRepository.getAccountingCatalogNotUsed(
              data.accountingCatalogPurchases,
              company,
            );
          }
        }
        break;
    }
    await this.customerRepository.updateCustomer(id, data, company, type);
    return {
      message: type == 'cliente' ? 'El cliente se actualizo correctamente' : 'El proveedor se actualizo correctamente',
    };
  }
  async deleteCustomer(company: Company, id: string, type = 'cliente'): Promise<ResponseMinimalDTO> {
    const person = await this.customerRepository.getCustomer(id, company, type);
    let result;
    if (type == 'cliente') {
      if (person.isProvider) {
        await this.customerRepository.updateCustomer(id, { isCustomer: false }, company, type);
      } else {
        result = await this.customerRepository.deleteCustomer(company, id, type);
        if (result.affected == 0) {
          throw new BadRequestException(`No se ha podido eliminar el ${type} seleccionado.`);
        }
      }
    } else {
      if (person.isCustomer) {
        await this.customerRepository.updateCustomer(id, { isProvider: false }, company, type);
      } else {
        result = await this.customerRepository.deleteCustomer(company, id, type);
        if (result.affected == 0) {
          throw new BadRequestException(`No se ha podido eliminar el ${type} seleccionado.`);
        }
      }
    }

    return {
      message:
        type == 'cliente' ? 'Se ha eliminado el cliente correctamente' : 'Se ha eliminado el proveedor correctamente',
    };
  }
}
