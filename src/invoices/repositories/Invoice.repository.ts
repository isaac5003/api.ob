import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { logDatabaseError, numeroALetras } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceFilterDTO } from '../dtos/invoice-filter.dto';
import { InvoiceHeaderDataDTO } from '../dtos/invoice-header-data.dto';
import { InvoiceHeaderDTO } from '../dtos/invoice-header.dto';
import { Invoice } from '../entities/Invoice.entity';
import { InvoicesDocument } from '../entities/InvoicesDocument.entity';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';

const reponame = 'documento';
@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {
  async getInvoices(
    company: Company,
    filter: Partial<InvoiceFilterDTO>,
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
        ])
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

      // TODO Completar filtros
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
        }
        query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
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
    branch: Branch,
    data: Partial<InvoiceHeaderDTO>,
    type: string,
    customer?: Customer,
    customerBranch?: CustomerBranch,
    invoiceSeller?: InvoicesSeller,
    invoicesPaymentCondition?: InvoicesPaymentsCondition,
    documentType?: InvoicesDocumentType,
    document?: InvoicesDocument,
    invoiceStatus?: InvoicesStatus,
  ): Promise<Invoice> {
    let response: Invoice;

    const header = {
      authorization: data.authorization,
      sequence: `${document.current}`,
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
      subTotal: data.subTotal,
      ivaRetenido: data.ivaRetenido,
      ventasExentas: data.ventasExentas,
      ventasNoSujetas: data.ventasNoSujetas,
      ventaTotal: data.ventaTotal,
      ventaTotalText: numeroALetras(data.ventaTotal),
      invoiceDate: data.invoiceDate,
      paymentConditionName: invoicesPaymentCondition.name,
      sellerName: invoiceSeller.name,
      zoneName: invoiceSeller.invoicesZone.name,
      branch: branch,
      company: company,
      customerBranch: customerBranch,
      customer: customer,
      invoicesPaymentsCondition: invoicesPaymentCondition,
      invoicesSeller: invoiceSeller,
      invoicesZone: invoiceSeller.invoicesZone,
      status: invoiceStatus,
      customerType: customer.customerType,
      customerTypeNatural: customer.customerTypeNatural,
      documentType: documentType,
    };
    try {
      switch (type) {
        case 'invoice':
          const invoice = this.create({ company, ...header });
          response = await this.save(invoice);
        case 'reserveInvoice':
      }
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
