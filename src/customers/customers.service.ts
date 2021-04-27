import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { CustomerIntegrationDTO } from './dtos/customer-integration.dto';
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
import { Injectable } from '@nestjs/common';
import { json } from 'express';

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

  async getCustomers(company: Company, data: CustomerFilterDTO): Promise<ResponseListDTO<Customer>> {
    const customers = await this.customerRepository.getCustomers(company, data);
    let customer = customers.map((c) => {
      const branch = c.customerBranches.find((b) => b.default == true);
      const phone = JSON.parse(JSON.stringify(branch.contactInfo)).phones;

      const cus = {
        ...c,
        contacName: branch.contactName,
        contactPhone: phone ? Object.values(phone)[0] : '',
      };

      return cus;
    });
    customer = customer.map((cu) => {
      const c = {
        ...cu,
      };
      delete c.customerBranches;
      return c;
    });

    return new ResponseListDTO(plainToClass(Customer, customer));
  }

  async getCustomer(company: Company, id: string): Promise<Customer> {
    return this.customerRepository.getCustomer(id, company);
  }

  async getCustomerIntegration(id: string, company: Company): Promise<ResponseMinimalDTO> {
    const { accountingCatalog } = await this.customerRepository.getCustomer(id, company, ['ac']);

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
    data: CustomerIntegrationDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data, company);

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

  async getCustomerTributary(id: string, company: Company): Promise<ResponseSingleDTO<Customer>> {
    const {
      dui,
      nit,
      nrc,
      giro,
      customerType,
      customerTaxerType,
      customerTypeNatural,
    } = await this.customerRepository.getCustomer(id, company);
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

  async getCustomerBranches(id: string): Promise<CustomerBranch[]> {
    return this.customerBranchRepository.getCustomerBranches(id);
  }

  async getCustomerTypes(): Promise<CustomerType[]> {
    console.log(this.customerTypeRepository.getCustomerTypes());

    return this.customerTypeRepository.getCustomerTypes();
  }

  async getCustomerTaxerTypes(): Promise<CustomerTaxerType[]> {
    return this.customerTaxerTypeRepository.getCustomerTaxerTypes();
  }

  async getCustomerTypeNaturals(): Promise<CustomerTypeNatural[]> {
    return this.customerTypeNaturalRepository.getCustomerTypeNaturals();
  }

  async createCustomer(company: Company, data): Promise<ResponseMinimalDTO> {
    const customer = await this.customerRepository.createCustomer(company, data);
    const { id } = customer;
    await this.customerBranchRepository.createBranch(id, data.branch);
    return {
      id: customer.id,
      message: 'Se ha creado el cliente correctamente',
    };
  }

  async updateCustomer(id: string, data: CustomerDataDTO, company: Company): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.updateBranch(id, data.branch);
    delete data.branch;

    await this.customerRepository.updateCustomer(id, data, company);
    return {
      message: 'El cliente se actualizo correctamente',
    };
  }

  async UpdateStatusCustomer(id: string, data: CustomerStatusDTO, company: Company): Promise<ResponseMinimalDTO> {
    await this.customerRepository.updateCustomer(id, data, company);
    return {
      message: 'El cliente se actualizo correctamente',
    };
  }

  async UpdateCustomerIntegration(
    id: string,
    data: CustomerIntegrationDTO,
    company: Company,
  ): Promise<ResponseMinimalDTO> {
    await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data, company);
    await this.customerRepository.updateCustomer(id, data, company);
    return {
      message: 'El cliente se actualizo correctamente',
    };
  }
  async deleteCustomer(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const result = await this.customerRepository.deleteCustomer(company, id);
    return {
      message: result ? 'Se ha eliminado el servicio correctamente' : 'No se ha podido eliminar el servicio',
    };
  }
}
