import { EntityRepository, Repository } from 'typeorm';
import { CustomerDataDTO } from '../dtos/customer-data.dto';
import { CustomerFilterDTO } from '../dtos/customer-filter.dto';
import { Customer } from '../entities/Customer.entity';
import { CustomerStatusDTO } from '../dtos/customer-status.dto';
import { CustomerIntegrationDTO } from '../dtos/customer-integration.dto';
import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';

const reponame = 'cliente';
@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async getCustomers(company: Company, filter: CustomerFilterDTO): Promise<Customer[]> {
    try {
      const { active, limit, page, search, order, prop } = filter;
      const query = this.createQueryBuilder('customer')
        .leftJoinAndSelect('customer.customerType', 'customerType')
        .leftJoinAndSelect('customer.customerTypeNatural', 'customerTypeNatural')
        .where({ company });

      if (active) {
        query.andWhere('customer.isActiveCustomer = :active', { active });
      }

      if (search) {
        query.andWhere('(LOWER(customer.name) LIKE :search)', {
          search: `%${search}%`,
        });
      }

      if (limit && page) {
        query.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
      }

      if (order && prop) {
        query.orderBy(`customer.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('customer.createdAt', 'DESC');
      }

      return await query.getMany();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async getCustomer(id: string, company: Company, joins: string[] = []): Promise<Customer> {
    let customer: Customer;
    const leftJoinAndSelect = {
      ct: 'c.customerType',
      ctt: 'c.customerTaxerType',
      ctn: 'c.customerTypeNatural',
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
      logDatabaseError(reponame, error);
    }
    return customer;
  }

  async createCustomer(company: Company, data: CustomerDataDTO): Promise<Customer> {
    let response: Customer;
    try {
      const customer = this.create({ company, ...data });
      response = await this.save(customer);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }
  async updateCustomer(
    id: string,
    data: CustomerDataDTO | CustomerStatusDTO | CustomerIntegrationDTO,
    company: Company,
  ): Promise<any> {
    try {
      const customer = this.update({ id, company }, data);
      return customer;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteCustomer(company: Company, id: string): Promise<boolean> {
    const customer = await this.getCustomer(id, company);
    try {
      await this.delete(customer);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
