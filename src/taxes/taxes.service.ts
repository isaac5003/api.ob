import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { InvoiceFilterDTO } from 'src/invoices/dtos/invoice-filter.dto';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { InvoiceDetailRepository } from 'src/invoices/repositories/InvoiceDetail.repository';
import { InvoicesDocumentTypeRepository } from 'src/invoices/repositories/InvoicesDocumentType.repository';
import { InvoicesStatusRepository } from 'src/invoices/repositories/InvoicesStatus.repository';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseListDTO, ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { RegisterTaxDTO } from './dtos/taxes-register.dto';
import { TaxesRepository } from './repositories/taxes.repository';

@Injectable()
export class TaxesService {
  constructor(
    @InjectRepository(InvoiceRepository)
    private invoiceRepository: InvoiceRepository,

    @InjectRepository(InvoiceDetailRepository)
    private invoiceDetailRepository: InvoiceDetailRepository,

    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,

    @InjectRepository(InvoicesDocumentTypeRepository)
    private invoicesDocumentTypeRepository: InvoicesDocumentTypeRepository,

    @InjectRepository(InvoicesStatusRepository)
    private invoiceStatusRepository: InvoicesStatusRepository,

    @InjectRepository(TaxesRepository)
    private taxesRepository: TaxesRepository,
  ) {}

  async createInvoice(data: RegisterTaxDTO, company: Company): Promise<ResponseMinimalDTO> {
    let invoice: Invoice;

    switch (data.registerType) {
      case 1:
        const customer = await this.customerRepository.getCustomer(data.customer, company, 'cliente');
        const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes([data.documentType]);
        const invoiceStatus = await this.invoiceStatusRepository.getInvoicesStatus(1);
        invoice = await this.invoiceRepository.createTaxesInvoice(
          data,
          customer,
          customer.customerBranches[0],
          company,
          documentType[0],
          invoiceStatus,
          'cfb8addb-541b-482f-8fa1-dfe5db03fdf4',
        );

        const details = {
          quantity: 1,
          unitPrice: data.subtotal,
          chargeDescription: 'Detalle generado automaticamente en modulo de IVA',
          incTax: false,
          ventaPrice: data.subtotal,
          invoice: invoice,
        };

        await this.invoiceDetailRepository.createInvoiceDetail([details]);
        break;
      case 2:
        break;
    }

    if (!invoice) {
      throw new BadRequestException('No se pudo guardar el registro de IVA');
    }
    return {
      id: invoice.id,
      message: 'El registro de IVA se creo correctamente.',
    };
  }

  // async getInvoices(
  //   company: Company,
  //   filter: InvoiceFilterDTO,
  // ): Promise<ResponseListDTO<Partial<Invoice>, number, number, number>> {
  //   const { data, count } = await this.taxesRepository.getInvoice(company, filter);
  //   const sales = data.map((s) => {
  //     return {
  //       invoiceDate: s.invoiceDate,
  //       customer: s.customer,
  //       authorization: s.authorization,
  //       sequence: s.sequence,
  //       documentType: s.documentType,
  //       iva: s.iva,
  //     };
  //   });

  //   return {
  //     data: sales,
  //     count,
  //     page: filter.page,
  //     limit: filter.limit,
  //   };
  // }
}
