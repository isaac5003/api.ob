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
    filterDto: CustomerFilterDTO,
  ): Promise<Customer[]> {
    return this.customerRepository.getCustomers(company, filterDto);
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
    company: Company,
    id: string,
    validatorCustomerDto,
  ): Promise<ResponseMinimalDTO> {
    await this.customerBranchRepository.updateBranch(
      id,
      validatorCustomerDto.branch,
    );
    delete validatorCustomerDto.branch;
    await this.customerRepository.updateCustomer(
      company,
      id,
      validatorCustomerDto,
    );
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
