import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceAuxiliarDataDTO } from '../dtos/invoice-auxiliar-data.dto';
import { SellerCreateDTO } from '../dtos/invoice-seller-create.dto';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';

const reponame = 'vendedor';
@EntityRepository(InvoicesSeller)
export class InvoicesSellerRepository extends Repository<InvoicesSeller> {
  async getAllSellers(
    company: Company,
    filter: FilterDTO,
  ): Promise<InvoicesSeller[]> {
    const { limit, page, search, active } = filter;

    try {
      const query = this.createQueryBuilder('s')
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
        });
      }
      // applies pagination
      if (limit && page) {
        query.take(limit).skip(limit ? (page ? page - 1 : 0 * limit) : null);
      }
      return await query.getMany();
    } catch (error) {
      console.log(error);
      logDatabaseError(reponame, error);
    }
  }

  async getSeller(
    company: Company,
    id: string,
    joins: string[] = [],
  ): Promise<InvoicesSeller> {
    let invoiceSeller: InvoicesSeller;

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

  async createSeller(
    company: Company,
    data: SellerCreateDTO,
  ): Promise<InvoicesSeller> {
    let response: InvoicesSeller;
    try {
      const invoiceSeller = this.create({ company, ...data });
      response = await this.save(invoiceSeller);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async updateSeller(
    id: string,
    company: Company,
    data: SellerCreateDTO,
  ): Promise<any> {
    try {
      const seller = this.update({ id, company }, data);
      return seller;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteSeller(company: Company, id: string): Promise<boolean> {
    try {
      await this.delete({ id, company });
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
