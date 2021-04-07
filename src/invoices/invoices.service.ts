import { BadRequestException, Injectable } from '@nestjs/common';
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
import { InvoiceReserveDataDTO } from './dtos/invoice-reserve-data.dto';
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

    const details = invoiceAll.invoiceDetails.map((d) => {
      const { id, name } = d.service;
      delete d.service;
      return {
        ...d,
        service: { id, name },
      };
    });

    delete invoiceAll.invoiceDetails;
    delete invoiceAll.invoicesPaymentsCondition.active;
    delete invoiceAll.invoicesPaymentsCondition.cashPayment;
    delete invoiceAll.invoicesSeller.active;
    delete invoiceAll.invoicesZone.active;

    const invoice = {
      ...invoiceAll,
      details,
      customer: {
        id: invoiceAll.customer.id,
        name: invoiceAll.customer.name,
      },
      customerBranch: {
        id: invoiceAll.customerBranch.id,
        name: invoiceAll.customerBranch.name,
      },
    };

    delete invoiceAll.customerBranch;
    delete invoiceAll.customer;
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
      data.header.documentType,
    );

    const allInvoicesReserved = await this.invoiceRepository.getInvoices(
      company,
      {
        status: 4,
        documentType: data.header.documentType,
      },
    );

    const document = await this.invoicesDocumentRepository.getSequenceAvailable(
      company,
      data.header.documentType,
      allInvoicesReserved.map((ir) => parseInt(ir.sequence)),
    );

    const invoiceHeader = await this.invoiceRepository.createInvoice(
      company,
      branch,
      data.header,
      customer,
      customerBranch,
      invoiceSeller,
      invoicesPaymentCondition,
      documentType,
      document,
      invoiceStatus,
    );

    let message = '';

    if (data.header.sequence != parseInt(invoiceHeader.sequence)) {
      message = `El numero de secuencia asignado fué: ${invoiceHeader.sequence}`;
    }

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

    let nextSequence = parseInt(invoiceHeader.sequence) + 1;
    if (
      allInvoicesReserved
        .map((ir) => parseInt(ir.sequence))
        .includes(nextSequence)
    ) {
      for (const is of allInvoicesReserved.map((ir) => parseInt(ir.sequence))) {
        for (let s = nextSequence; s <= document.final; s++) {
          if (s != is) {
            nextSequence = s;
            s = document.final;
          }
        }
      }
    }
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

  async createInvoiceReserve(
    company: Company,
    branch: Branch,
    data: InvoiceReserveDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentType(
      data.documentType,
    );

    const invoiceStatus = await this.invoiceStatusRepository.getInvoiceStatus(
      4,
    );
    const document = await this.invoicesDocumentRepository.getSequenceAvailable(
      company,
      data.documentType,
    );
    if (
      data.sequenceForm < document.current ||
      data.sequenceTo > document.final
    ) {
      throw new BadRequestException(
        `El numero de sequencia debe ser mayor o igual a ${document.current} y menor o igual a ${document.final}`,
      );
    }
    const allInvoicesReserved = await this.invoiceRepository.getInvoices(
      company,
      {
        status: 4,
        documentType: data.documentType,
      },
    );

    const sequence = [];
    for (let s = data.sequenceForm; s <= data.sequenceTo; s++) {
      sequence.push(s);
    }

    const invoicesSequence = allInvoicesReserved.map((is) =>
      parseInt(is.sequence),
    );
    const alreadyReserved = invoicesSequence.filter((is) =>
      sequence.includes(is),
    );
    const sequenceToReserve = sequence.filter(
      (s) => !alreadyReserved.includes(s),
    );

    const invoiceValues = sequenceToReserve.map((sr) => {
      return {
        authorization: document.authorization,
        sequence: sr,
        company: company,
        documentType: documentType,
        status: invoiceStatus,
      };
    });

    await this.invoiceRepository.createReserveInvoice(
      company,
      branch,
      invoiceValues,
    );

    if (data.sequenceForm == document.current) {
      await this.invoicesDocumentRepository.updateInvoiceDocument(
        document.id,
        { current: data.sequenceTo + 1 },
        company,
      );
    }

    return {
      message:
        alreadyReserved.length > 0 && sequenceToReserve.length > 0
          ? `Los documentos ${alreadyReserved.join(
              ', ',
            )} ya estan reservados, unicamente se reservaron los documentos con sequencia ${sequenceToReserve.join(
              ', ',
            )} correctamente.`
          : sequenceToReserve.length > 0
          ? `Los documentos con sequencia ${sequenceToReserve.join(
              ', ',
            )} han sido reservados correctamente.`
          : `Los documentos con secuencia ${alreadyReserved.join(
              ', ',
            )} ya estan reservados`,
    };
  }

  async deleteInvoice(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    const allowedStatuses = [1];
    if (!allowedStatuses.includes(invoice.status.id)) {
      throw new BadRequestException(
        `La venta seleccionada no puede ser eliminada mientras tenga estado "${invoice.status.name.toUpperCase()}"`,
      );
    }

    const document = await this.invoicesDocumentRepository.getSequenceAvailable(
      company,
      invoice.documentType.id,
    );
    if (document.current - 1 != parseInt(invoice.sequence)) {
      throw new BadRequestException(
        'La venta seleccionada no puede ser eliminada, solo puede ser anulada ya que no es el ultimo correlativo ingresado.',
      );
    }
    const detailsIds = invoice.invoiceDetails.map((id) => id.id);

    await this.invoiceDetailRepository.deleteInvoiceDetail(detailsIds);

    const result = await this.invoiceRepository.deleteInvoice(
      company,
      id,
      invoice,
    );

    await this.invoicesDocumentRepository.updateInvoiceDocument(
      document.id,
      { current: document.current - 1 },
      company,
    );

    return {
      message: result
        ? 'Se ha eliminado la venta correctamente'
        : 'No se ha podido eliminar venta',
    };
  }
}
