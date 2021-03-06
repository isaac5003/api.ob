import { Company } from '../../companies/entities/Company.entity';
import { FilterDTO } from '../../_dtos/filter.dto';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoiceSellerDataDTO } from '../dtos/sellers/invoice-data.dto';
import { InvoicesSellers } from '../entities/invoices.sellers.entity';
import { paginate, paginateRaw } from 'nestjs-typeorm-paginate';

const reponame = 'vendedor';
@EntityRepository(InvoicesSellers)
export class InvoicesSellersRepository extends Repository<InvoicesSellers> {
  async getInvoicesSellers(company: Company, filter: FilterDTO): Promise<{ data: InvoicesSellers[]; count: number }> {
    const { limit, page, search, active } = filter;

    try {
      const query = this.createQueryBuilder('s')
        .leftJoinAndSelect('s.invoicesZone', 'sz')
        .where({ company })
        .orderBy('s.createdAt', 'DESC');

      // filter by status
      if (active || active == false) {
        query.andWhere('s.active = :active', { active });
      }

      // filter by search value
      if (search) {
        query.andWhere('LOWER(s.name) LIKE :search', {
          search: `%${search}%`,
          company: company.id,
        });
      }
      const count = await query.getCount();
      const data = await paginate<InvoicesSellers>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
    } catch (error) {
      console.log(error);
      logDatabaseError(reponame, error);
    }
  }

  async createInvoicesSeller(company: Company, data: InvoiceSellerDataDTO): Promise<InvoicesSellers> {
    let response: InvoicesSellers;
    try {
      const invoiceSeller = this.create({ company, ...data });
      response = await this.save(invoiceSeller);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async getInvoicesSeller(company: Company, id: string, joins: string[] = []): Promise<InvoicesSellers> {
    let invoiceSeller: InvoicesSellers;

    const leftJoinAndSelect = {
      iz: 'i.invoicesZone',
    };

    for (const table of joins) {
      switch (table) {
        case 'ac':
          leftJoinAndSelect['ac'] = 'i.accountingCatalog';
          break;
      }
    }

    try {
      invoiceSeller = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'i',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoiceSeller;
  }

  async updateInvoicesSeller(
    id: string,
    company: Company,
    data: InvoiceSellerDataDTO | ActiveValidateDTO,
  ): Promise<InvoicesSellers> {
    try {
      await this.update({ id, company }, data);
      return this.findOne({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteInvoicesSeller(company: Company, id: string): Promise<boolean> {
    try {
      await this.delete({ id, company });
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
