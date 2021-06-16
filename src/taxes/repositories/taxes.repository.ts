import { paginate } from 'nestjs-typeorm-paginate';
import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { TaxesFilterDTO } from '../dtos/taxes-filter.dto';
import { TaxesView } from '../entities/taxes-view.entity';

const reponame = 'registro de iva';
@EntityRepository(TaxesView)
export class TaxesRepository extends Repository<TaxesView> {
  async getRegisters(company: Company, filter: Partial<TaxesFilterDTO>): Promise<{ data: TaxesView[]; count: number }> {
    const { limit, page, search, documentType, customer, startDate, endDate, prop, order, registerType } = filter;
    try {
      const query = this.createQueryBuilder('r').where('r.company =:company', { company: company.id });
      //filter by documentType
      if (documentType) {
        query.andWhere('r.documentTypeId = :documentType', { documentType });
      }

      //filter by registerType
      if (registerType) {
        query.andWhere('r.type = :registerType', { registerType });
      }

      //filter by customer
      if (customer) {
        query.andWhere('r.customerId = :customer', { customer });
      }

      // filter by range of dates
      if (startDate) {
        query.andWhere('r.date >= :startDate', {
          startDate,
        });
      }
      if (endDate) {
        query.andWhere('r.date <= :endDate', { endDate });
      }
      // sort by prop}
      if (order && prop) {
        let field = `r.${prop}`;
        switch (prop) {
          case 'registerType':
            field = `r.type`;
            break;
        }
        query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('r.createdAt', 'DESC');
      }
      // filter by search value
      if (search) {
        query.andWhere('LOWER(r.name) LIKE :search', {
          search: `%${search}%`,
        });
      }
      const count = await query.getCount();

      const data = await paginate<TaxesView>(query, { limit, page });
      return { data: data.items, count };
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
  }
  async getRegister(company: Company, id: string): Promise<TaxesView> {
    let taxes;
    try {
      taxes = await this.findOneOrFail({ id, company: company.id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }

    return taxes;
  }
}
