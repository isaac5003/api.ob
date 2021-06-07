import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { InvoiceDetailRepository } from 'src/invoices/repositories/InvoiceDetail.repository';
import { InvoicesDocumentTypeRepository } from 'src/invoices/repositories/InvoicesDocumentType.repository';
import { InvoicesStatusRepository } from 'src/invoices/repositories/InvoicesStatus.repository';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseListDTO, ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { RegisterTaxDTO } from './dtos/taxes-register.dto';

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
    console.log(invoice);

    if (!invoice) {
      throw new BadRequestException('No se pudo guardar el registro de IVA');
    }
    return {
      id: invoice.id,
      message: 'El registro de IVA se creo correctamente.',
    };
  }

  async getInvoice(
    company: Company,
    filter: FilterDTO,
  ): Promise<ResponseListDTO<Partial<Invoice>, number, number, number>> {
    const { data, count } = await this.invoiceRepository.getInvoices(company, filter);
    console.log(data);

    return {
      data: data,
      count,
      page: filter.page,
      limit: filter.limit,
    };
  }
}
