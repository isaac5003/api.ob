import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { logDatabaseError, numeroALetras } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceFilterDTO } from '../dtos/invoice-filter.dto';
import { Invoice } from '../entities/Invoice.entity';
import { InvoicesDocument } from '../entities/InvoicesDocument.entity';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { InvoiceBaseDTO } from '../dtos/invoice-base.dto';

const reponame = 'documento';
@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {
  async getInvoices(company: Company, filter: Partial<InvoiceFilterDTO>): Promise<{ data: Invoice[]; count: number }> {
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
        .leftJoinAndSelect('i.documentType', 'dt')
        .leftJoinAndSelect('i.status', 'st')
        .leftJoin('i.customer', 'cu')
        .leftJoin('i.invoicesSeller', 'sl')
        .leftJoin('i.invoicesZone', 'zo')
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
        let field = `i.${prop}`;
        switch (prop) {
          case 'service':
            field = `s.id`;
            break;
          case 'customer':
            field = `c.id`;
            break;
          case 'seller':
            field = `sl.id`;
            break;
          case 'zone':
            field = `zo.id`;
            break;
        }
        query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('i.createdAt', 'DESC');
      }

      // filter by search value
      if (search) {
        query.andWhere(
          'LOWER(s.name) LIKE :search OR LOWER(s.description) LIKE :search OR LOWER(zo.name) LIKE :search OR LOWER(cu.name) LIKE :search OR LOWER(sl.name) LIKE :search',
          {
            search: `%${search}%`,
            company: company.id,
          },
        );
      }
      const count = await query.getCount();

      const data = await paginate<Invoice>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
  }

  async getInvoice(company: Company, id: string, joins: string[] = []): Promise<Invoice> {
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
    branch: Branch,
    data: Partial<InvoiceBaseDTO>,
    customer: Customer,
    customerBranch: CustomerBranch,
    invoiceSeller?: InvoicesSeller,
    invoicesPaymentCondition?: InvoicesPaymentsCondition,
    documentType?: InvoicesDocumentType,
    document?: InvoicesDocument,
    invoiceStatus?: InvoicesStatus,
    origin?: string,
  ): Promise<Invoice> {
    let response: Invoice;

    const header = {
      authorization: data.authorization,
      sequence: document ? `${document.current}` : `${data.sequence}`,
      customerName: customer.name,
      customerAddress1: customerBranch.address1,
      customerAddress2: customerBranch.address2,
      customerCountry: customerBranch.country.name,
      customerState: customerBranch.state.name,
      customerCity: customerBranch.city.name,
      customerDui: customer.dui,
      customerNit: customer.nit,
      customerNrc: customer.nrc,
      customerGiro: customer.giro,
      sum: data.sum,
      iva: data.iva,
      subtotal: data.subtotal,
      ivaRetenido: data.ivaRetenido,
      ventasExentas: data.ventasExentas,
      ventasNoSujetas: data.ventasNoSujetas,
      ventaTotal: data.ventaTotal,
      ventaTotalText: numeroALetras(data.ventaTotal),
      invoiceDate: data.invoiceDate,
      paymentConditionName: invoicesPaymentCondition ? invoicesPaymentCondition.name : null,
      sellerName: invoiceSeller ? invoiceSeller.name : null,
      zoneName: invoiceSeller ? invoiceSeller.invoicesZone.name : null,
      branch: branch,
      company: company,
      customerBranch: customerBranch,
      customer: customer,
      invoicesPaymentsCondition: invoicesPaymentCondition,
      invoicesSeller: invoiceSeller,
      invoicesZone: invoiceSeller ? invoiceSeller.invoicesZone : null,
      status: invoiceStatus,
      customerType: customer.customerType,
      customerTypeNatural: customer.customerTypeNatural,
      documentType: documentType,
      origin: origin ? origin : 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4',
    };
    try {
      const invoice = this.create({ company, ...header });
      response = await this.save(invoice);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async createReserveInvoice(company: Company, branch: Branch, data: any): Promise<Partial<Invoice[]>> {
    let response;
    try {
      const invoice = this.create([...data]);
      response = await this.save(invoice);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async updateInvoice(id: string[], data: any): Promise<any> {
    try {
      const invoice = this.update(id, data);
      return invoice;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteInvoice(company: Company, id: string, invoice: Invoice): Promise<boolean> {
    try {
      await this.delete(invoice.id);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
