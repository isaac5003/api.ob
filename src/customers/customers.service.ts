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
import { CustomerSettingRepository } from './repositories/CustomerSetting.repository';
import { Company } from '../companies/entities/Company.entity';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProviderStatusDTO } from '../providers/dtos/provider-updateStatus.dto';
import { BranchDataDTO } from './dtos/customer-branch.dto';
import { FilterDTO } from 'src/_dtos/filter.dto';

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

    @InjectRepository(CustomerSettingRepository)
    private customerSettingRepository: CustomerSettingRepository,
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

  async getCustomerIntegration(id: string, company: Company, type = 'cliente'): Promise<ResponseMinimalDTO> {
    const { accountingCatalog } = await this.customerRepository.getCustomer(id, company, type, ['ac']);

    return {
      integrations: {
        catalog: accountingCatalog ? accountingCatalog.id : null,
      },
    };
  }

  async getCustomerSettingIntegrations(company: Company): Promise<ResponseMinimalDTO> {
    const settings = await this.customerSettingRepository.getCustomerSettingIntegrations(company);

    return {
      integrations: {
        catalog: settings && settings.accountingCatalog ? settings.accountingCatalog.id : null,
      },
    };
  }

  async updateCustomerSettingsIntegrations(
    company: Company,
    data: AccountignCatalogIntegrationDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalog, company);

    const settings = await this.customerSettingRepository.getCustomerSettingIntegrations(company);
    if (settings) {
      await this.customerSettingRepository.updateCustomerSetting(company, data);
      return {
        message: 'La integración ha sido actualizada correctamente.',
      };
    }

    await this.customerSettingRepository.createSettingIntegration(company, data);
    return {
      message: 'La integración ha sido agregada correctamente.',
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

  async UpdateCustomerIntegration(
    id: string,
    data: AccountignCatalogIntegrationDTO,
    company: Company,
    type = 'cliente',
  ): Promise<ResponseMinimalDTO> {
    await this.customerRepository.getCustomer(id, company, type);
    if (data.accountingCatalog) {
      await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalog, company);
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
