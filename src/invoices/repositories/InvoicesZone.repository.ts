import { Company } from '../../companies/entities/Company.entity';
import { FilterDTO } from '../../_dtos/filter.dto';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoiceZonesDataDTO } from '../dtos/zones/invoice-data.dto';
import { InvoicesZone } from '../entities/InvoicesZone.entity';
import { paginate, paginateRaw } from 'nestjs-typeorm-paginate';

const reponame = 'zonas';
@EntityRepository(InvoicesZone)
export class InvoicesZoneRepository extends Repository<InvoicesZone> {
  async getInvoicesZones(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<{ data: InvoicesZone[]; count: number }> {
    const { limit, page, search, active } = filter;
    try {
      const query = this.createQueryBuilder('iz').where({ company }).orderBy('iz.createdAt', 'DESC');
      // filter by status
      if (active) {
        query.andWhere('iz.active = :active', { active });
      }
      // filter by search value
      if (search) {
        query.andWhere('LOWER(iz.name) LIKE :search', {
          search: `%${search}%`,
        });
      }
      const count = await query.getCount();
      const data = await paginate<InvoicesZone>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
    } catch (error) {
      console.log(error);
      logDatabaseError(reponame, error);
    }
  }

  async createInvoicesZone(company: Company, data: InvoiceZonesDataDTO): Promise<InvoicesZone> {
    let response: InvoicesZone;
    try {
      const invoiceZone = this.create({ company, ...data });
      response = await this.save(invoiceZone);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async getInvoicesZone(company: Company, id: string): Promise<InvoicesZone> {
    let invoicesZone: InvoicesZone;
    try {
      invoicesZone = await this.findOneOrFail({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoicesZone;
  }

  async updateInvoicesZone(
    id: string,
    company: Company,
    data: InvoiceZonesDataDTO | ActiveValidateDTO,
  ): Promise<InvoicesZone> {
    try {
      this.update({ id, company }, data);
      return this.findOne({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteInvoicesZone(company: Company, id: string): Promise<boolean> {
    try {
      await this.delete({ id, company });
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
