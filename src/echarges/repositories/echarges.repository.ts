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
    const { limit, page, search, documentType, customer, status, startDate, endDate, prop, order } = filter;

    try {
      const query = this.createQueryBuilder('e')
        // .leftJoinAndSelect('i.documentType', 'dt')
        .leftJoinAndSelect('e.status', 'st')
        .leftJoin('e.customer', 'cu')
        .where({ company });

      // //filter by documentType
      // if (documentType) {
      //   query.andWhere('dt.id = :documentType', { documentType });
      // }
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
        query.andWhere('i.invoiceDate >= :startDate', {
          startDate,
        });
      }
      if (endDate) {
        query.andWhere('i.invoiceDate <= :endDate', { endDate });
      }

      // sort by prop}
      if (order && prop) {
        let field = `e.${prop}`;
        switch (prop) {
          case 'customer':
            field = `cu.id`;
            break;
        }
        query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('i.createdAt', 'DESC');
      }

      // filter by search value
      if (search) {
        query.andWhere('LOWER(cu.name) LIKE :search ', {
          search: `%${search}%`,
          company: company.id,
        });
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
