import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { CustomerBranchRepository } from 'src/customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from 'src/services/repositories/Service.repository';
import {
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { numeroALetras } from 'src/_tools';
import { InvoiceDataDTO } from './dtos/invoice-data.dto';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { Invoice } from './entities/Invoice.entity';
import { InvoiceRepository } from './repositories/Invoice.repository';
import { InvoiceDetailRepository } from './repositories/InvoiceDetail.repository';
import { InvoicesDocumentRepository } from './repositories/InvoicesDocument.repository';
import { InvoicesDocumentTypeRepository } from './repositories/InvoicesDocumentType.repository';
import { InvoicesPaymentsConditionRepository } from './repositories/InvoicesPaymentsCondition.repository';
import { InvoicesSellerRepository } from './repositories/InvoicesSeller.repository';
import { InvoicesStatusRepository } from './repositories/InvoicesStatus.repository';

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

    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,

    @InjectRepository(InvoicesStatusRepository)
    private invoiceStatusRepository: InvoicesStatusRepository,

    @InjectRepository(InvoicesPaymentsConditionRepository)
    private invoicesPaymentsConditionRepository: InvoicesPaymentsConditionRepository,

    @InjectRepository(InvoicesDocumentTypeRepository)
    private invoicesDocumentTypeRepository: InvoicesDocumentTypeRepository,

    @InjectRepository(InvoiceDetailRepository)
    private invoiceDetailRepository: InvoiceDetailRepository,

    @InjectRepository(InvoicesDocumentRepository)
    private invoicesDocumentRepository: InvoicesDocumentRepository,
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
    branch: Branch,
    data: InvoiceDataDTO,
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
    const invoiceStatus = await this.invoiceStatusRepository.getInvoiceStatus(
      1,
    );
    const invoicesPaymentCondition = await this.invoicesPaymentsConditionRepository.getInvoicePaymentCondition(
      data.header.invoicesPaymentsCondition,
      company,
    );
    const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentType(
      parseInt(data.header.documentType),
    );

    const documents = await this.invoicesDocumentRepository.getInvoicesDocuments(
      company,
    );

    const document = documents.find(
      (id) =>
        id.isCurrentDocument == true &&
        id.documentType.id == parseInt(data.header.documentType),
    );

    const allInvoices = await this.invoiceRepository.getInvoices(company, {
      status: 4,
      documentType: parseInt(data.header.documentType),
    });

    let message = '';
    const sequence = document.current;
    if (parseInt(data.header.sequence) != sequence) {
      message = `El numero de secuencia asignado fué: ${sequence}`;
    }
    let nextSequence = sequence + 1;
    if (allInvoices.length > 0) {
      const invoicesSequence = allInvoices.map((is) => parseInt(is.sequence));

      //definiendo el valor de sequence
      if (invoicesSequence.includes(sequence)) {
        for (const is of invoicesSequence) {
          for (let s = sequence; s <= document.final; s++) {
            if (s != is) {
              nextSequence = s;
              s = document.final;
            }
          }
        }
      }
    }

    const header = {
      authorization: data.header.authorization,
      sequence: `${sequence}`,
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
      subTotal: data.header.subTotal,
      ivaRetenido: data.header.ivaRetenido,
      ventasExentas: data.header.ventasExentas,
      ventasNoSujetas: data.header.ventasNoSujetas,
      ventaTotal: data.header.ventaTotal,
      ventaTotalText: numeroALetras(data.header.ventaTotal),
      invoiceDate: data.header.invoiceDate,
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

    const invoiceHeader = await this.invoiceRepository.createInvoice(
      company,
      header,
    );

    const details = [];
    for (const detail of data.details) {
      const service = await this.serviceRepository.getService(
        company,
        detail.selectedService,
      );
      details.push({
        ...detail,
        service,
        sellingType: service.sellingType,
        invoice: invoiceHeader,
      });
    }
    await this.invoiceDetailRepository.createInvoiceDetail(details);
    await this.invoicesDocumentRepository.updateInvoiceDocument(
      document.id,
      { current: nextSequence },
      company,
    );

    return {
      id: invoiceHeader.id,
      message: `La venta ha sido registrada correctamente. ${message}`,
    };
  }
}
