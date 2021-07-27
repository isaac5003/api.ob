import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { logDatabaseError, numeroALetras } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceFilterDTO } from '../dtos/invoice-filter.dto';
import { Invoices } from '../entities/invoices.entity';
import { InvoicesDocuments } from '../entities/invoices.documents.entity';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';
import { InvoicesPaymentsConditions } from '../entities/invoices.paymentsConditions.entity';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';
import { paginate } from 'nestjs-typeorm-paginate';
import { InvoiceBaseDTO } from '../dtos/invoice-base.dto';
import { format, subDays, subMonths } from 'date-fns';

const reponame = 'documento';
@EntityRepository(Invoices)
export class InvoiceRepository extends Repository<Invoices> {
  async getInvoices(company: Company, filter: Partial<InvoiceFilterDTO>): Promise<{ data: Invoices[]; count: number }> {
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
      const data = await paginate<Invoices>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
  }

  async getInvoice(company: Company, id: string, joins: string[] = []): Promise<Invoices> {
    let invoice: Invoices;

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
      e: 'i.accountingEntry',
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

  /**
   * Metodo utilizado para obtener una venta mediante el id
   * @param id de la venta que se desea obtener
   * @returns un objeto del tipo invoice, donde se devuelven todos los campos del header
   */
  async getInvoiceById(id: string): Promise<Invoices> {
    let invoice: Invoices;
    try {
      invoice = await this.findOne(id);
    } catch (error) {
      console.error(error);
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
    invoicesPaymentCondition?: InvoicesPaymentsConditions,
    documentType?: InvoicesDocumentType,
    document?: InvoicesDocuments,
    invoiceStatus?: InvoicesStatus,
    origin?: string,
  ): Promise<Invoices> {
    let response: Invoices;

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

  async createReserveInvoice(company: Company, branch: Branch, data: any): Promise<Partial<Invoices[]>> {
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

  async deleteInvoice(company: Company, id: string, invoice: Invoices): Promise<boolean> {
    try {
      await this.delete(invoice.id);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return true;
  }

  /**
   * Metodo utilizado para obtener las ventas que pertecen a cada una de las compañias si estas cumples las condiciones
   * requeridas para obtenerlas
   * @param companies Un arreglo de ids de compañias que tienen integracion activa
   * @param recurrency parametro opcional,id de la recurrencia que esta invoicando el metodo del cronjob
   * @param invoiceId parametro opcional, id de la venta que se esta actulizando
   * @returns retorna un arreglo de objetos, que contienen las ventas que pertenecen a cada una de las compañias
   * que se reciben
   */
  async getInvoicesForEntries(companies: string[], recurrency: number, invoiceId?: string): Promise<any[]> {
    let query;
    let accountingEntry = null;
    try {
      query = this.createQueryBuilder('i')
        .select([
          'i.id',
          'cu.id',
          'cu.name',
          'i.invoiceDate',
          'i.companyId',
          'i.accountingEntryId',
          'i.createEntry',
          'd.id',
          's.id',
          'd.ventaPrice',
          'd.quantity',
          's.name',
          's.incIva',
          'c.id',
          'c.name',
          'ii.id',
          'ii.metaKey',
          'ii.metaValue',
          'ip.id',
          'ip.name',
          'ip.cashPayment',
          'idt.id',
          'idt.name',
          'idt.code',
          'i.authorization',
          'i.sequence',
          'i.ventaTotal',
          'i.iva',
          'i.sum',
          'd.unitPrice',
          'd.quantity',
        ])
        .leftJoin('i.customer', 'cu')
        .leftJoin('i.company', 'c')
        .leftJoin('i.invoiceDetails', 'd')
        .leftJoin('d.service', 's')
        .leftJoin('i.status', 'st')
        .leftJoin('i.documentType', 'idt')
        .leftJoin('i.invoicesPaymentsCondition', 'ip')
        .leftJoin('c.invoicesIntegration', 'ii')
        .where('i.company IN (:...companies)', { companies })
        .andWhere('i.createEntry =true')

        .andWhere('ii.module  =:module', { module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8' })
        .andWhere('i.status IN (:...status)', { status: [1, 2, 5] });

      if (!invoiceId) {
        query.andWhere('i.accountingEntryId IS NULL');
      } else {
        const currentInvoice = await this.getInvoiceById(invoiceId);
        accountingEntry = currentInvoice.accountingEntry;
        query.andWhere('i.id=:accountingEntry', { accountingEntry });
      }

      query = await query.getMany();
    } catch (error) {
      console.error(error);
      logDatabaseError('reponame', error);
    }

    let invoices;
    if (!invoiceId) {
      const frecuencyOption = format(Date.now(), 'cccccc');
      switch (recurrency) {
        case 1:
          invoices = query.filter(
            (i) =>
              parseInt(i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyFrecuency').metaValue) ==
                1 && i.invoiceDate == format(subDays(Date.now(), 1), 'yyyy-MM-dd'),
          );

          break;
        case 2:
          invoices = query.filter(
            (i) =>
              parseInt(i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyFrecuency').metaValue) ==
                2 &&
              i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyOption').metaValue ==
                frecuencyOption &&
              i.invoiceDate == format(subDays(Date.now(), 1), 'yyyy-MM-dd'),
          );

          break;
        case 3:
          invoices = query.filter(
            (i) =>
              parseInt(i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyFrecuency').metaValue) ==
                3 &&
              i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyOption').metaValue ==
                frecuencyOption &&
              i.invoiceDate == format(subDays(Date.now(), 1), 'yyyy-MM-dd'),
          );
          break;
        case 4:
          invoices = query.filter(
            (i) =>
              parseInt(i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyFrecuency').metaValue) ==
                4 &&
              i.company.invoicesIntegration.find((ii) => ii.metaKey == 'recurrencyOption').metaValue ==
                format(Date.now(), 'd') &&
              i.invoiceDate >= format(subMonths(new Date(), 1), 'yyyy-MM-dd') &&
              i.invoiceDate < format(Date.now(), 'yyyy-MM-dd'),
          );
          break;
      }
    }

    const values = companies
      .map((c) => {
        return {
          id: accountingEntry,
          invoices: invoices.filter((i) => i.company.id == c),
        };
      })
      .filter((v) => v.invoices.length > 0);

    return values;
  }
}
