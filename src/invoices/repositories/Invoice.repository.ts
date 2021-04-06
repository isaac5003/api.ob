import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceFilterDTO } from '../dtos/invoice-filter.dto';
import { InvoiceHeaderDataDTO } from '../dtos/invoice-header-data.dto';
import { Invoice } from '../entities/Invoice.entity';

const reponame = 'documento';
@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {
  async getInvoices(
    company: Company,
    filter: InvoiceFilterDTO,
  ): Promise<Invoice[]> {
    const {
      limit,
      page,
      search,
      documentType,
      customer,
      seller,
      zone,
      service,
      status,
      startDate,
      endDate,
      prop,
      order,
    } = filter;

    try {
      const query = this.createQueryBuilder('i')
        .select([
          'i.id',
          'i.authorization',
          'i.sequence',
          'i.invoiceDate',
          'i.ventaTotal',
          'i.customerName',
          'i.createdAt',
          'st.id',
          'st.name',
          'dt.id',
          'dt.name',
          'dt.code',
        ])
        .leftJoin('i.documentType', 'dt')
        .leftJoin('i.customer', 'cu')
        .leftJoin('i.invoicesSeller', 'sl')
        .leftJoin('i.invoicesZone', 'zo')
        .leftJoin('i.status', 'st')
        .leftJoin('i.invoiceDetails', 'd')
        .leftJoin('d.service', 's')
        .where({ company });

      //filter by documentType
      if (documentType) {
        query.andWhere('dt.id = :documentType', { documentType });
      }
      //filter by customer
      if (customer) {
        query.andWhere('cu.id = :customer', { customer });
      }

      //filter by seller
      if (seller) {
        query.andWhere('sl.id = :seller', { seller });
      }

      // filter by zone
      if (zone) {
        query.andWhere('zo.id = :zone', { zone });
      }

      // filter by status
      if (status) {
        query.andWhere('st.id = :status', { status });
      }

      // filter by service
      if (service) {
        query.andWhere('s.id = :service', { service });
      }

      // filter by range of dates
      if (startDate && endDate) {
        query.andWhere('i.invoiceDate >= :startDate', {
          startDate,
        });
        query.andWhere('i.invoiceDate <= :endDate', { endDate });
      }

      // sort by prop}
      if (order && prop) {
        query.orderBy(`i.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('i.createdAt', 'DESC');
      }

      // filter by search value
      if (search) {
        query.andWhere(
          'LOWER(s.name) LIKE :search OR LOWER(s.description) LIKE :search',
          {
            search: `%${search}%`,
          },
        );
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

  async getInvoice(
    company: Company,
    id: string,
    joins: string[] = [],
  ): Promise<Invoice> {
    let invoice: Invoice;

    const leftJoinAndSelect = {
      id: 'i.invoiceDetails',
      s: 'id.service',
      st: 'id.sellingType',
      c: 'i.customer',
      cb: 'i.customerBranch',
      ct: 'i.customerType',
      ctn: 'i.customerTypeNatural',
      dt: 'i.documentType',
      ipc: 'i.invoicesPaymentsCondition',
      is: 'i.invoicesSeller',
      iz: 'i.invoicesZone',
      status: 'i.status',
    };

    for (const table of joins) {
      switch (table) {
        case 'ac':
          leftJoinAndSelect['ac'] = 'i.accountingCatalog';
          break;
      }
    }

    try {
      invoice = await this.findOneOrFail(
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
    return invoice;
  }

  async createInvoice(
    company: Company,
    data: InvoiceHeaderDataDTO,
  ): Promise<Invoice> {
    let response: Invoice;
    try {
      const invoice = this.create({ company, ...data });
      response = await this.save(invoice);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
