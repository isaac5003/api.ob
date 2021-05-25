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
    const customers = await this.customerRepository.getCustomers(company, { branch: true }, type);

    const report = {
      company: {
        name: company.name,
        nrc: company.nrc,
        nit: company.nit,
      },
      name: 'REPORTE GENERAL DE CLIENTES',
      customers: customers
        .map((c) => {
          const phones = c.customerBranches.find((cb) => cb.default).contactInfo.phones;
          return {
            ...c,
            contactName: c.customerBranches.find((cb) => cb.default).contactName,
            contactPhone: phones ? (phones.length > 0 ? phones[0] : '') : '',
          };
        })
        .map((cu) => {
          delete cu.customerBranches,
            delete cu.shortName,
            delete cu.customerTaxerType,
            delete cu.customerTypeNatural,
            delete cu.isActiveProvider;
          delete cu.isCustomer, delete cu.isProvider, delete cu.isActiveCustomer;
          return {
            ...cu,
          };
        }),
      providers: customers
        .map((c) => {
          const phones = c.customerBranches.find((cb) => cb.default).contactInfo.phones;
          return {
            ...c,
            contactName: c.customerBranches.find((cb) => cb.default).contactName,
            contactPhone: phones ? (phones.length > 0 ? phones[0] : '') : '',
          };
        })
        .map((cu) => {
          delete cu.customerBranches,
            delete cu.shortName,
            delete cu.customerTaxerType,
            delete cu.customerTypeNatural,
            delete cu.isActiveProvider;
          delete cu.isCustomer, delete cu.isProvider, delete cu.isActiveCustomer;
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
    delete customer.isActiveCustomer, delete customer.isActiveProvider, delete customer.isProvider;
    const report = {
      company: {
        name: company.name,
        nrc: company.nrc,
        nit: company.nit,
      },
      name: 'PERFIL DEL CLIENTE',

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
    } else {
      delete report.provider;
    }
    return report;
  }

  async getCustomers(company: Company, data: CustomerFilterDTO, type = 'clientes'): Promise<Customer[]> {
    return await this.customerRepository.getCustomers(company, data, type);
  }

  async getCustomer(company: Company, id: string, type = 'cliente'): Promise<Customer> {
    const customer = await this.customerRepository.getCustomer(id, company, type);

    if (type == 'proveedor') {
      if (!customer.isProvider) {
        throw new BadRequestException('El proveedor seleccionado no existe.');
      }

      return customer;
    }
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
    type = 'cliente',
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
    const {
      dui,
      nit,
      nrc,
      giro,
      customerType,
      customerTaxerType,
      customerTypeNatural,
    } = await this.customerRepository.getCustomer(id, company, type);
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

  async getCustomerBranches(id: string, type = 'cliente'): Promise<CustomerBranch[]> {
    return this.customerBranchRepository.getCustomerBranches(id, type);
  }

  async getCustomerTypes(): Promise<CustomerType[]> {
    return this.customerTypeRepository.getCustomerTypes();
  }

  async getCustomerTaxerTypes(): Promise<CustomerTaxerType[]> {
    return this.customerTaxerTypeRepository.getCustomerTaxerTypes();
  }

  async getCustomerTypeNaturals(): Promise<CustomerTypeNatural[]> {
    return this.customerTypeNaturalRepository.getCustomerTypeNaturals();
  }

  async createCustomer(company: Company, data, type = 'cliente'): Promise<ResponseMinimalDTO> {
    let message = 'Se ha creado el cliente correctamente';
    if (type == 'proveedor') {
      data = {
        ...data,
        isProvider: true,
        isActiveProvider: true,
        isCustomer: false,
        isActiveCustomer: false,
      };

      message = 'Se ha creado el proveedor correctamente';
    }
    const customer = await this.customerRepository.createCustomer(company, data, type);
    const { id } = customer;
    const branch = {
      ...data.branch,
      customer: id,
    };
    await this.customerBranchRepository.createBranch(branch, type);
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

    await this.customerRepository.updateCustomer(id, data, company, type);

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
    await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalog, company);
    await this.customerRepository.updateCustomer(id, data, company, type);
    return {
      message: type == 'cliente' ? 'El cliente se actualizo correctamente' : 'El proveedor se actualizo correctamente',
    };
  }
  async deleteCustomer(company: Company, id: string, type = 'cliente'): Promise<ResponseMinimalDTO> {
    const result = await this.customerRepository.deleteCustomer(company, id, type);
    return {
      message:
        type == 'cliente'
          ? result
            ? 'Se ha eliminado el cliente correctamente'
            : 'No se ha podido eliminar el cliente'
          : result
          ? 'Se ha eliminado el proveedor correctamente'
          : 'No se ha podido eliminar el proveedor',
    };
  }
}
