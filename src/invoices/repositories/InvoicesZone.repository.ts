import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceAuxiliarDataDTO } from '../dtos/invoice-auxiliar-data.dto';
import { InvoicesZone } from '../entities/InvoicesZone.entity';

const reponame = 'zonas';
@EntityRepository(InvoicesZone)
export class InvoicesZoneRepository extends Repository<InvoicesZone> {
  async getInvoicesZones(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<InvoicesZone[]> {
    const { limit, page, search, active } = filter;

    try {
      const query = this.createQueryBuilder('iz')
        .where({ company })
        .orderBy('iz.createdAt', 'DESC');

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

  async getInvoiceZone(company: Company, id: string): Promise<InvoicesZone> {
    let invoicesZone: InvoicesZone;
    try {
      invoicesZone = await this.findOneOrFail({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoicesZone;
  }

  async createInvoiceZone(
    company: Company,
    data: InvoiceAuxiliarDataDTO,
  ): Promise<InvoicesZone> {
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

  async updateInvoiceZone(
    id: string,
    company: Company,
    data: Partial<InvoiceAuxiliarDataDTO>,
  ): Promise<any> {
    try {
      const invoiceZone = this.update({ id, company }, data);
      return invoiceZone;
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
