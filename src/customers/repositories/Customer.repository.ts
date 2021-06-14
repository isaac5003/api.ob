import { EntityRepository, Repository } from 'typeorm';
import { CustomerDataDTO } from '../dtos/customer-data.dto';
import { CustomerFilterDTO } from '../dtos/customer-filter.dto';
import { Customer } from '../entities/Customer.entity';
import { CustomerStatusDTO } from '../dtos/customer-status.dto';
import { AccountignCatalogIntegrationDTO } from '../dtos/customer-integration.dto';
import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { ProviderStatusDTO } from 'src/providers/dtos/provider-updateStatus.dto';
import { paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async getCustomers(
    company: Company,
    filter: Partial<CustomerFilterDTO>,
    type: string,
  ): Promise<{ data: Customer[]; count: number }> {
    try {
      const { active, limit, page, search, order, prop, branch } = filter;
      const query = this.createQueryBuilder('customer')
        .leftJoinAndSelect('customer.customerType', 'customerType')
        .leftJoinAndSelect('customer.customerTypeNatural', 'customerTypeNatural')
        .where({ company });

      switch (type) {
        case 'clientes':
          query.andWhere('customer.isCustomer =:customer', { customer: true });
          if (active == true || active == false) {
            query.andWhere('customer.isActiveCustomer = :active', { active });
          }
          break;
        case 'proveedores':
          query.andWhere('customer.isProvider =:customer', { customer: true });
          if (active == true || active == false) {
            query.andWhere('customer.isActiveProvider = :active', { active });
          }
          break;
      }

      if (branch) {
        query.leftJoinAndSelect('customer.customerBranches', 'customerBranches');
      }

      if (search) {
        query.andWhere('(LOWER(customer.name) LIKE :search)', {
          search: `%${search}%`,
        });
      }

      const count = await query.getCount();

      if (order && prop) {
        query.orderBy(`customer.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('customer.createdAt', 'DESC');
      }
      const data = await paginate<Customer>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
    } catch (error) {
      console.error(error);

      logDatabaseError(type, error);
    }
  }

  async getCustomer(id: string, company: Company, type: string, joins: string[] = []): Promise<Customer> {
    let customer: Customer;
    const leftJoinAndSelect = {
      ct: 'c.customerType',
      ctt: 'c.customerTaxerType',
      ctn: 'c.customerTypeNatural',
      cb: 'c.customerBranches',
      bc: 'cb.country',
      bs: 'cb.state',
      bct: 'cb.city',
    };

    for (const table of joins) {
      switch (table) {
        case 'ac':
          leftJoinAndSelect['ac'] = 'c.accountingCatalog';
          break;
      }
    }

    try {
      customer = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'c',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
    return customer;
  }

  async createCustomer(company: Company, data: CustomerDataDTO, type: string): Promise<Customer> {
    let response: Customer;
    try {
      const customer = this.create({ company, ...data });
      response = await this.save(customer);
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
    return await response;
  }
  async updateCustomer(
    id: string,
    data:
      | Partial<CustomerDataDTO>
      | Partial<CustomerStatusDTO>
      | Partial<ProviderStatusDTO>
      | Partial<AccountignCatalogIntegrationDTO>,
    company: Company,
    type: string,
  ): Promise<any> {
    try {
      const customer = this.update({ id, company }, data);
      return customer;
    } catch (error) {
      logDatabaseError(type, error);
    }
  }

  async deleteCustomer(company: Company, id: string, type: string): Promise<boolean> {
    const customer = await this.getCustomer(id, company, type);

    try {
      await this.delete(customer.id);
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
    return true;
  }
}
