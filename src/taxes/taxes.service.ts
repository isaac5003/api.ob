import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { InvoiceDetailRepository } from 'src/invoices/repositories/InvoiceDetail.repository';
import { InvoicesDocumentTypeRepository } from 'src/invoices/repositories/InvoicesDocumentType.repository';
import { InvoicesStatusRepository } from 'src/invoices/repositories/InvoicesStatus.repository';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { TaxesFilterDTO } from './dtos/taxes-filter.dto';
import { TaxesInvoiceHeaderDTO, TaxesPurchaseHeaderDTO } from './dtos/taxes-header.dto';
import { TaxesView } from './entities/taxes-view.entity';
import { TaxesRepository } from './repositories/taxes.repository';
import { format } from 'date-fns';
import { Purchase } from 'src/purchases/entities/Purchase.entity';
import { PurchaseRepository } from 'src/purchases/repositories/Purchase.repository';
import { plainToClass } from 'class-transformer';
import { RInvoice, RPurchase } from './dtos/taxes-response.dto';
import { Branch } from 'src/companies/entities/Branch.entity';

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

    @InjectRepository(PurchaseRepository)
    private purchaseRepository: PurchaseRepository,
  ) {}

  async createRegister(
    data: Partial<TaxesInvoiceHeaderDTO> | Partial<TaxesPurchaseHeaderDTO>,
    company: Company,
    branch: Branch,
  ): Promise<ResponseMinimalDTO> {
    let invoice: Invoice;

    switch (data.registerType) {
      case 'invoices':
        const customer = await this.customerRepository.getCustomer(data.customer, company, 'cliente');
        const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes([data.documentType]);
        const invoiceStatus = await this.invoiceStatusRepository.getInvoicesStatus(5);
        invoice = await this.invoiceRepository.createInvoice(
          company,
          branch,
          data,
          customer,
          customer.customerBranches.find((b) => b.default),
          null,
          null,
          documentType[0],
          null,
          invoiceStatus,
          '53a36e54-bab2-4824-9e43-b40efab8bab9',
        );

        const details = {
          quantity: 1,
          unitPrice: data.subtotal,
          chargeDescription: 'Detalle generado automaticamente en modulo de IVA',
          incTax: true,
          ventaPrice: data.subtotal,
          invoice: invoice,
        };

        await this.invoiceDetailRepository.createInvoiceDetail([details]);
        break;
      case 'purchases':
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

  async getRegisters(
    company: Company,
    filter: TaxesFilterDTO,
  ): Promise<ResponseListDTO<Partial<TaxesView>, number, number, number>> {
    const { data, count } = await this.taxesRepository.getRegisters(company, filter);
    const registers = data.map((r) => {
      return {
        id: r.id,
        date: format(new Date(r.date), 'dd/MM/yyyy'),
        name: r.name,
        authorization: r.authorization,
        documentType: r.documentType,
        registerType: r.type == 'invoices' ? 'Debito fiscal' : 'Credito fiscal',
        iva: r.iva,
      };
    });
    return {
      data: registers,
      count,
      page: filter.page,
      limit: filter.limit,
    };
  }

  async getRegister(
    id: string,
    company: Company,
  ): Promise<
    ResponseSingleDTO<Partial<{ registerType: string } & Invoice> | Partial<{ registerType: string } & Purchase>>
  > {
    let data;

    const register = await this.taxesRepository.getRegister(company, id);

    switch (register.type) {
      case 'invoices':
        data = await this.invoiceRepository.getInvoice(company, id);

        data = {
          id: data.id,
          registerType: 'Debito fiscal',
          documentType: data.documentType,
          authorization: data.authorization,
          sequence: data.sequence,
          invoiceDate: data.invoiceDate,
          customer: { id: data.customer.id, name: data.customer.name, shortName: data.customer.shortName },
          subtotal: data.subtotal,
          iva: data.iva,
          ventaTotal: data.ventaTotal,
          origin: data.origin,
        };

        return new ResponseSingleDTO(plainToClass(RInvoice, data));
      case 'purchases':
        data = await this.purchaseRepository.getPurchase(company, id);

        data = {
          id: data.id,
          registerType: 'Credito fiscal',
          documentType: data.documentType,
          authorization: data.authorization,
          sequence: data.sequence,
          purchaseDate: data.purchaseDate,
          customer: { id: data.customer.id, name: data.customer.name, shortName: data.customer.shortName },
          subtotal: data.subtotal,
          iva: data.iva,
          ventaTotal: data.ventaTotal,
          origin: data.origin,
        };

        return new ResponseSingleDTO(plainToClass(RPurchase, data));
    }
  }
}
