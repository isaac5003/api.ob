import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { CompanyRepository } from 'src/companies/repositories/Company.repository';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { CustomerIntegrationDTO } from './dtos/customer-integration.dto';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';
import { CustomerRepository } from './repositories/Customer.repository';
import { CustomerBranchRepository } from './repositories/CustomerBranch.repository';
import { CustomerStatusDTO } from './dtos/status-validator-dto';
import { CustomerValidateDTO } from './dtos/customer-validator.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    @InjectRepository(CustomerBranchRepository)
    private customerBranchRepository: CustomerBranchRepository,
  ) {}

  async getCustomers(
    company: Company,
    data: CustomerFilterDTO,
  ): Promise<Customer[]> {
    return this.customerRepository.getCustomers(company, data);
  }

  async getCustomer(company: Company, id: string): Promise<Customer> {
    return this.customerRepository.getCustomer(company, id);
  }

  async createCustomer(
    company: Company,
    validatorCustomerDto,
  ): Promise<ResponseMinimalDTO> {
    const customer = await this.customerRepository.createCustomer(
      company,
      validatorCustomerDto,
    );
    const { id } = customer;
    await this.customerBranchRepository.createBranch(
      id,
      validatorCustomerDto.branch,
    );
    return {
      id: customer.id,
      message: 'Se ha creado el cliente correctamente',
    };
  }

  async updateCustomer(
    id: string,
    data: CustomerValidateDTO,
    company: Company,
  ): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.updateBranch(id, data.branch);
    delete data.branch;

    await this.customerRepository.updateCustomer(company, id, data);
    return {
      message: 'El cliente se actualizo correctamente',
    };
  }

  // async getCustomerIntegration(
  //   id: string,
  // ): Promise<{ integrations: any | null }> {
  //   return this.customerRepository.getCustomerIntegration(id);
  // }

  // async updateCustomerIntegration(id: string, validatorCustomerAccountingDTO) {
  //   const { accountingCatalog } = validatorCustomerAccountingDTO;
  //   const account = await this.accountingCatalogRepository.getAccountingCatalogById(
  //     accountingCatalog,
  //   );
  //   return this.customerRepository.updateCustomerIntegration(id, account);
  // }
}
