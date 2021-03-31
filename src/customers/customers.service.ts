import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';
import { CustomerAccountingValidateDTO } from './dtos/accounting-validator.dto';
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

  async getCustomers(filterDto: CustomerFilterDTO): Promise<Customer[]> {
    return this.customerRepository.getCustomers(filterDto);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.customerRepository.getCustomerById(id);
  }

  async createCustomer(
    validatorCustomerDto,
  ): Promise<{ message: string; id: string }> {
    const customer = await this.customerRepository.createCustomer(
      validatorCustomerDto,
    );
    const { id } = customer;
    await this.customerBranchRepository.createBranch(
      id,
      validatorCustomerDto.branch,
    );
    return customer;
  }

  async updateCustomer(
    id: string,
    validatorCustomerDto,
  ): Promise<{ message: string }> {
    const customer = await this.customerRepository.updateCustomer(
      id,
      validatorCustomerDto,
    );
    await this.customerBranchRepository.updateBranch(
      id,
      validatorCustomerDto.branch,
    );
    return customer;
  }

  async updateCustomerStatus(
    id: string,
    validatorCustomerStatusDto,
  ): Promise<{ message: string }> {
    return this.customerRepository.updateCustomerStatus(
      id,
      validatorCustomerStatusDto,
    );
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
