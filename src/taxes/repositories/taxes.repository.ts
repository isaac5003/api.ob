import { Company } from 'src/companies/entities/Company.entity';
import { InvoiceFilterDTO } from 'src/invoices/dtos/invoice-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { TaxesView } from '../entities/taxes-view.entity';

@EntityRepository(TaxesView)
export class TaxesRepository extends Repository<TaxesRepository> {
  // async getRegisters(
  //   company: Company,
  //   filter: Partial<InvoiceFilterDTO>,
  // ): Promise<{ data: TaxesView[]; count: number }> {
  //   const {
  //     limit,
  //     page,
  //     search,
  //     documentType,
  //     customer,
  //     seller,
  //     zone,
  //     service,
  //     status,
  //     startDate,
  //     endDate,
  //     prop,
  //     order,
  //   } = filter;
  //   try {
  //     const query = this.createQueryBuilder('i')
  //       .leftJoinAndSelect('i.documentType', 'dt')
  //       .leftJoinAndSelect('i.status', 'st')
  //       .leftJoin('i.customer', 'cu')
  //       .leftJoin('i.invoicesSeller', 'sl')
  //       .leftJoin('i.invoicesZone', 'zo')
  //       .leftJoin('i.invoiceDetails', 'd')
  //       .leftJoin('d.service', 's')
  //       .where({ company });
  //     //filter by documentType
  //     if (documentType) {
  //       query.andWhere('dt.id = :documentType', { documentType });
  //     }
  //     //filter by customer
  //     if (customer) {
  //       query.andWhere('cu.id = :customer', { customer });
  //     }
  //     //filter by seller
  //     if (seller) {
  //       query.andWhere('sl.id = :seller', { seller });
  //     }
  //     // filter by zone
  //     if (zone) {
  //       query.andWhere('zo.id = :zone', { zone });
  //     }
  //     // filter by status
  //     if (status) {
  //       query.andWhere('st.id = :status', { status });
  //     }
  //     // filter by service
  //     if (service) {
  //       query.andWhere('s.id = :service', { service });
  //     }
  //     // filter by range of dates
  //     if (startDate) {
  //       query.andWhere('i.invoiceDate >= :startDate', {
  //         startDate,
  //       });
  //     }
  //     if (endDate) {
  //       query.andWhere('i.invoiceDate <= :endDate', { endDate });
  //     }
  //     // sort by prop}
  //     if (order && prop) {
  //       let field = `i.${prop}`;
  //       switch (prop) {
  //         case 'service':
  //           field = `s.id`;
  //           break;
  //         case 'customer':
  //           field = `c.id`;
  //           break;
  //         case 'seller':
  //           field = `sl.id`;
  //           break;
  //         case 'zone':
  //           field = `zo.id`;
  //           break;
  //       }
  //       query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
  //     } else {
  //       query.orderBy('i.createdAt', 'DESC');
  //     }
  //     // filter by search value
  //     if (search) {
  //       query.andWhere(
  //         'LOWER(s.name) LIKE :search OR LOWER(s.description) LIKE :search OR LOWER(zo.name) LIKE :search OR LOWER(cu.name) LIKE :search OR LOWER(sl.name) LIKE :search',
  //         {
  //           search: `%${search}%`,
  //         },
  //       );
  //     }
  //     const count = await query.getCount();
  //     // applies pagination
  //     if (limit && page) {
  //       query.take(limit).skip(limit ? (page ? page - 1 : 0 * limit) : null);
  //     }
  //     const data = await paginate<Invoice>(query, { limit, page });
  //     return { data: data.items, count };
  //   } catch (error) {
  //     console.error(error);
  //     logDatabaseError(reponame, error);
  //   }
  // }
}
