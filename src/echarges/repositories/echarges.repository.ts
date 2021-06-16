import { paginate } from 'nestjs-typeorm-paginate';
import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { EchargesFilterDTO } from '../dtos/echages-filter.dto';
import { Echarges } from '../entities/echarges.entity';

const reponame = 'registro de cobro electronico';
@EntityRepository(Echarges)
export class EchargesRepository extends Repository<Echarges> {
  async getEcharges(company: Company, filter: EchargesFilterDTO): Promise<{ data: Echarges[]; count: number }> {
    const { limit, page, search, echargesType, customer, status, startDate, endDate, prop, order } = filter;

    try {
      const query = this.createQueryBuilder('e')
        .leftJoinAndSelect('e.status', 'st')
        .leftJoin('e.customer', 'cu')
        .where({ company });

      //filter by ECHARGEtYPE
      if (echargesType) {
        query.andWhere('e.echargeType = :echargesType', { echargesType });
      }
      //filter by customer
      if (customer) {
        query.andWhere('cu.id = :customer', { customer });
      }

      // filter by status
      if (status) {
        query.andWhere('st.id = :status', { status });
      }

      // filter by range of dates
      if (startDate) {
        query.andWhere('e.createdAt >= :startDate', {
          startDate,
        });
      }
      if (endDate) {
        query.andWhere('e.createdAt <= :endDate', { endDate });
      }

      // sort by prop}
      if (order && prop) {
        let field = `e.${prop}`;
        switch (prop) {
          case 'customer':
            field = `cu.id`;
            break;
          case 'date':
            field = `e.createdAt`;
            break;
        }
        query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('e.createdAt', 'DESC');
      }

      // filter by search value
      if (search) {
        query.andWhere(
          'LOWER(e.customerName) LIKE :search OR LOWER(e.echargeType) LIKE :search OR e.sequence LIKE :search OR  CAST ( e.total AS varchar ) LIKE :search OR LOWER(st.name) LIKE :search',
          {
            search: `%${search}%`,
            company: company.id,
          },
        );
      }
      const count = await query.getCount();

      const data = await paginate<Echarges>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
  }

  async getEcharge(company: Company, id: string, joins: string[] = []): Promise<Echarges> {
    let invoice: Echarges;

    const leftJoinAndSelect = {
      c: 'e.customer',
      i: 'e.invoice',
      rq: 'e.request',
      rs: 'e.response',
      st: 'e.status',
    };

    // for (const table of joins) {
    //   switch (table) {
    //     case 'ac':
    //       leftJoinAndSelect['ac'] = 'i.accountingCatalog';
    //       break;
    //   }
    // }

    try {
      invoice = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'e',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoice;
  }

  async createEcharge(data: any) {
    let response;
    try {
      const echarge = this.create({ ...data });
      response = await this.save(echarge);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return await response;
  }
  async updateRegister(data: any, id: string, company): Promise<any> {
    try {
      const echarge = this.update({ id, company }, data);
      return echarge;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
