import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { CustomerBranchRepository } from 'src/customers/repositories/CustomerBranch.repository';
import {
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { InvoiceDataDTO } from './dtos/invoice-data.dto';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { Invoice } from './entities/Invoice.entity';
import { InvoiceRepository } from './repositories/Invoice.repository';
import { InvoicesSellerRepository } from './repositories/InvoicesSeller.repository';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceRepository)
    private invoiceRepository: InvoiceRepository,

    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,

    @InjectRepository(CustomerBranchRepository)
    private customerBranchRepository: CustomerBranchRepository,

    @InjectRepository(InvoicesSellerRepository)
    private invoiceSellerRepository: InvoicesSellerRepository,
  ) {}

  async getInvoices(
    company: Company,
    filter: InvoiceFilterDTO,
  ): Promise<Invoice[]> {
    return this.invoiceRepository.getInvoices(company, filter);
  }

  async getInvoice(
    company: Company,
    id: string,
  ): Promise<ResponseSingleDTO<Invoice>> {
    const invoiceAll = await this.invoiceRepository.getInvoice(company, id);
    const invoice = {
      id: invoiceAll.id,
      authorization: invoiceAll.authorization,
      sequence: invoiceAll.sequence,
      customerName: invoiceAll.customerName,
      customerAddress1: invoiceAll.customerAddress1,
      customerAddress2: invoiceAll.customerAddress2,
      customerCountry: invoiceAll.customerCountry,
      customerState: invoiceAll.customerState,
      customerCity: invoiceAll.customerCity,
      customerDui: invoiceAll.customerDui,
      customerNit: invoiceAll.customerNit,
      customerNrc: invoiceAll.customerNrc,
      customerGiro: invoiceAll.customerGiro,
      sum: invoiceAll.sum,
      iva: invoiceAll.iva,
      subtotal: invoiceAll.subtotal,
      ivaRetenido: invoiceAll.ivaRetenido,
      ventasExentas: invoiceAll.ventasExentas,
      ventasNoSujetas: invoiceAll.ventasNoSujetas,
      ventaTotal: invoiceAll.ventaTotal,
      ventaTotalText: invoiceAll.ventaTotalText,
      invoiceDate: invoiceAll.invoiceDate,
      paymentConditionName: invoiceAll.paymentConditionName,
      sellerName: invoiceAll.sellerName,
      zoneName: invoiceAll.zoneName,
      invoiceDetails: invoiceAll.invoiceDetails.map((id) => {
        const detail = {
          id: id.id,
          quantity: id.quantity,
          unitPrice: id.unitPrice,
          incTax: id.incTax,
          ventaPrice: id.ventaPrice,
          chargeDescription: id.chargeDescription,
          service: {
            id: id.service.id,
            name: id.service.name,
          },
          sellingType: {
            id: id.sellingType.id,
            name: id.sellingType.name,
          },
        };
        return detail;
      }),
      customer: {
        id: invoiceAll.customer.id,
        name: invoiceAll.customer.name,
      },
      customerBranch: {
        id: invoiceAll.customerBranch.id,
        name: invoiceAll.customerBranch.name,
      },
      customerType: invoiceAll.customerType,
      customerTypeNatural: invoiceAll.customerTypeNatural,
      documentType: invoiceAll.documentType,
      invoicesPaymantsCondition: {
        id: invoiceAll.invoicesPaymentsCondition.id,
        name: invoiceAll.invoicesPaymentsCondition.name,
      },
      invoicesSeller: {
        id: invoiceAll.invoicesSeller.id,
        name: invoiceAll.invoicesSeller.name,
      },
      invoicesZone: {
        id: invoiceAll.invoicesZone.id,
        name: invoiceAll.invoicesZone.name,
      },
      status: invoiceAll.status,
    };
    return new ResponseSingleDTO(plainToClass(Invoice, invoice));
  }

  async createInvoice(
    company: Company,
    data: InvoiceDataDTO,
    branch: Branch,
  ): Promise<ResponseMinimalDTO> {
    const customer = await this.customerRepository.getCustomer(
      data.header.customer,
      company,
    );
    const customerBranch = await this.customerBranchRepository.getCustomerCustomerBranch(
      data.header.customerBranch,
    );

    const invoiceSeller = await this.invoiceSellerRepository.getSeller(
      company,
      data.header.invoicesSeller,
    );

    console.log(customerBranch);
    console.log(company);
    console.log(invoiceSeller);

    const header = {
      authorization: data.header.authorization,
      sequence: data.header.sequence,
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
      sum: data.header.sum,
      iva: data.header.iva,
      subtotal: data.header.subTotal,
      ivaRetenido: data.header.ivaRetenido,
      ventasExentas: data.header.ventasExentas,
      ventasNoSujetas: data.header.ventasNoSujetas,
      ventaTotal: data.header.ventaTotal,
      ventaTotalText: data.header.ventaTotal,
      invoiceDate: data.header.invoiceDate,
      paymentConditionName: data.header,
      sellerName: invoiceSeller.name,
      zoneName: invoiceSeller.invoicesZone.name,
      branch: branch,
      company: company,
      customerBranch: customerBranch,
      customer: customer,
      invoicesPaymentsCondition: data.header,
      invoicesSeller: invoiceSeller,
      invoicesZone: invoiceSeller.invoicesZone,
      status: data.header,
      customerType: data.header,
      customerTypeNatural: data.header,
      documentType: data.header,
      invoiceDetails: data.header,
    };
    const { details } = data;

    // const invoice = await this.invoiceRepository.createInvoice(company, data);
    // console.log(invoice);

    return {
      message: 'El servicio se ha creado correctamente',
    };
  }
}
