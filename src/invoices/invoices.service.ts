import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { CustomerBranchRepository } from 'src/customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from 'src/services/repositories/Service.repository';
import { FilterDTO } from 'src/_dtos/filter.dto';
import {
  ResponseListDTO,
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { numeroALetras, validationMessage } from 'src/_tools';
import { ActiveValidateDTO } from './dtos/invoice-active-auxiliar.dto';
import { InvoiceAuxiliarDataDTO } from './dtos/invoice-auxiliar-data.dto';
import { InvoiceAuxiliarUpdateDTO } from './dtos/invoice-auxiliar-update.dto';
import { InvoiceDataDTO } from './dtos/invoice-data.dto';
import { InvoiceDocumentDataDTO } from './dtos/invoice-document-data.dto';
import { InvoiceDocumentDBDTO } from './dtos/invoice-document-db.dto';
import { InvoiceDocumentFilterDTO } from './dtos/invoice-document-filter.dto';
import { DocumentUpdateDTO } from './dtos/invoice-document-update.dto';
import { DocumentLayoutDTO } from './dtos/invoice-documentLayout.dto';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { PaymentConditionCreateDTO } from './dtos/invoice-paymentcondition-data.dto';
import { ReportFilterDTO } from './dtos/invoice-report-filter.dto';
import { InvoiceReserveDataDTO } from './dtos/invoice-reserve-data.dto';
import { SellerCreateDTO } from './dtos/invoice-seller-create.dto';
import { InvoiceSellerDataDTO } from './dtos/invoice-seller-data.dto';
import { Invoice } from './entities/Invoice.entity';
import { InvoicesDocument } from './entities/InvoicesDocument.entity';
import { InvoicesDocumentType } from './entities/InvoicesDocumentType.entity';
import { InvoicesPaymentsCondition } from './entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from './entities/InvoicesSeller.entity';
import { InvoicesStatus } from './entities/InvoicesStatus.entity';
import { InvoicesZone } from './entities/InvoicesZone.entity';
import { InvoiceRepository } from './repositories/Invoice.repository';
import { InvoiceDetailRepository } from './repositories/InvoiceDetail.repository';
import { InvoicesDocumentRepository } from './repositories/InvoicesDocument.repository';
import { InvoicesDocumentTypeRepository } from './repositories/InvoicesDocumentType.repository';
import { InvoicesPaymentsConditionRepository } from './repositories/InvoicesPaymentsCondition.repository';
import { InvoicesSellerRepository } from './repositories/InvoicesSeller.repository';
import { InvoicesStatusRepository } from './repositories/InvoicesStatus.repository';
import { InvoicesZoneRepository } from './repositories/InvoicesZone.repository';

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

    @InjectRepository(InvoicesZoneRepository)
    private invoicesZoneRepository: InvoicesZoneRepository,
  ) {}

  async getInvoiceDocumentsType(): Promise<InvoicesDocumentType[]> {
    return await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes();
  }

  async getInvoiceStatuses(): Promise<InvoicesStatus[]> {
    return await this.invoiceStatusRepository.getInvoicesStatus();
  }
  async updateInvoiceStatus(
    company: Company,
    id: string,
    type: string,
  ): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    let status: InvoicesStatus;
    let statuses = [];

    switch (type) {
      case 'void':
        status = await this.invoiceStatusRepository.getInvoiceStatus(3);
        // Verifica que tenga uno de los estados que pueden anularse
        statuses = [1, 2];
        break;
      case 'printed':
        status = await this.invoiceStatusRepository.getInvoiceStatus(2);
        statuses = [1, 2];
        break;
      case 'paid':
        status = await this.invoiceStatusRepository.getInvoiceStatus(5);
        statuses = [2];
        break;
      case 'reverse':
        let newStatus = null;
        switch (invoice.status.id) {
          case 2:
            newStatus = 1;
            break;
          case 3:
            newStatus = 2;
            break;
          case 5:
            newStatus = 2;
            break;
        }

        status = await this.invoiceStatusRepository.getInvoiceStatus(newStatus);
        statuses = [2, 3, 5];
        break;
    }

    if (!statuses.includes(invoice.status.id)) {
      throw new BadRequestException(
        validationMessage(status.name.toLowerCase(), 'status'),
      );
    }
    await this.invoiceRepository.updateInvoice(invoice.id, company, { status });

    return {
      message:
        type == 'reverse'
          ? `La venta ha sido marcada como ${status.name.toLowerCase()}, se revertio correctamente.`
          : `La venta ha sido marcada como ${status.name.toLowerCase()} correctamente.`,
    };
  }

  async getInvoiceZones(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<InvoicesZone[]> {
    return await this.invoicesZoneRepository.getInvoicesZones(company, filter);
  }

  async createInvoiceZone(
    company: Company,
    data: InvoiceAuxiliarDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const invoiceZone = await this.invoicesZoneRepository.createInvoiceZone(
      company,
      data,
    );
    return {
      id: invoiceZone.id,
      message: 'La zona se creo correctamente.',
    };
  }

  async updateInvoiceZone(
    id: string,
    company: Company,
    data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesZoneRepository.getInvoiceZone(company, id);

    await this.invoicesZoneRepository.updateInvoiceZone(id, company, data);
    return {
      message: 'La zona se actualizo correctamente',
    };
  }

  async deleteInvoiceZone(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesZoneRepository.getInvoiceZone(company, id);

    const result = await this.invoicesZoneRepository.deleteInvoicesZone(
      company,
      id,
    );

    return {
      message: result
        ? 'Se ha eliminado la zona correctamente'
        : 'No se ha podido eliminar zona',
    };
  }

  async getInvoicePaymentConditions(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<InvoicesPaymentsCondition[]> {
    return await this.invoicesPaymentsConditionRepository.getInvoicePaymentConditions(
      company,
      filter,
    );
  }

  async createInvoicePaymentCondition(
    company: Company,
    data: PaymentConditionCreateDTO,
  ): Promise<ResponseMinimalDTO> {
    const invoicePayment = await this.invoicesPaymentsConditionRepository.createInvoicePaymentCondition(
      company,
      data,
    );
    return {
      id: invoicePayment.id,
      message: 'La condicion de pago se creo correctamente.',
    };
  }

  async updateInvoicePaymentCondition(
    id: string,
    company: Company,
    data: Partial<InvoiceAuxiliarUpdateDTO>,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesPaymentsConditionRepository.getInvoicePaymentCondition(
      id,
      company,
    );

    await this.invoicesPaymentsConditionRepository.updateInvoicePaymentCondition(
      id,
      company,
      data,
    );
    return {
      message: 'La condicion de pago se actualizo correctamente',
    };
  }

  async deleteInvoicePaymentCondition(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesPaymentsConditionRepository.getInvoicePaymentCondition(
      id,
      company,
    );

    const result = await this.invoicesPaymentsConditionRepository.deleteInvoicePaymentCondition(
      company,
      id,
    );

    return {
      message: result
        ? 'Se ha eliminado la condicion de pago correctamente correctamente'
        : 'No se ha podido eliminar condicion de pago correctamente',
    };
  }

  async getSellers(
    company: Company,
    filter: FilterDTO,
  ): Promise<InvoicesSeller[]> {
    return await this.invoiceSellerRepository.getAllSellers(company, filter);
  }

  async createSeller(
    company: Company,
    data: InvoiceSellerDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const invoicesZone = await this.invoicesZoneRepository.getInvoiceZone(
      company,
      data.invoicesZone,
    );
    const sellerToCreate = {
      ...data,
      invoicesZone,
    };

    const seller = await this.invoiceSellerRepository.createSeller(
      company,
      sellerToCreate,
    );

    return {
      id: seller.id,
      message: 'El vendedor se ha creado correctamente',
    };
  }

  async updateSeller(
    id: string,
    company: Company,
    data: Partial<InvoiceAuxiliarUpdateDTO>,
    type: string,
  ): Promise<ResponseMinimalDTO> {
    await this.invoiceSellerRepository.getSeller(company, id);
    let seller;
    switch (type) {
      case 'seller':
        const invoicesZone = await this.invoicesZoneRepository.getInvoiceZone(
          company,
          data.invoicesZone,
        );
        seller = {
          ...data,
          invoicesZone,
        };
        break;
      case 'status':
        seller = {
          active: data.active,
        };
        break;
    }

    await this.invoiceSellerRepository.updateSeller(id, company, seller);

    return {
      message: 'El vendedor se actualizo correctamente.',
    };
  }

  async deleteSeller(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    await this.invoiceSellerRepository.getSeller(company, id);

    const result = await this.invoiceSellerRepository.deleteSeller(company, id);

    return {
      message: result
        ? 'Se ha eliminado el vendedor correctamente'
        : 'No se ha podido eliminar el vendedor',
    };
  }

  async getDocuments(
    company: Company,
  ): Promise<ResponseListDTO<InvoicesDocument>> {
    const documents = await this.invoicesDocumentRepository.getInvoicesDocuments(
      company,
    );
    const documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes();

    const doc = documentTypes.map((dt) => {
      const found = documents.find((d) => d.documentType.id == dt.id);
      return found
        ? { ...found, documentLayout: JSON.parse(found.documentLayout) }
        : {
            id: null,
            authorization: null,
            initial: null,
            final: null,
            current: null,
            active: false,
            documentType: dt,
          };
    });
    return new ResponseListDTO(plainToClass(InvoicesDocument, doc));
  }

  async getDocument(
    company: Company,
    id: string,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    const document = await this.invoicesDocumentRepository.getDocumentsByIds(
      company,
      [id],
      'all',
    );

    return new ResponseSingleDTO(plainToClass(InvoicesDocument, document[0]));
  }
  async createUpdateDocument(
    company: Company,
    data: any[],
    type: string,
  ): Promise<ResponseMinimalDTO> {
    const documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentType(
      data.map((d) => d.documentType),
    );

    let documentsToUpdate;
    let documentsNotExist;
    let document = [];
    switch (type) {
      case 'create':
        let documents = await this.invoicesDocumentRepository.getInvoicesDocuments(
          company,
        );
        documents = documents.filter((d) =>
          documentTypes.map((dt) => dt.id).includes(d.documentType.id),
        );

        const documentToUpdate = documents.map((d) => {
          return {
            ...d,
            isCurrentDocument: false,
            active: false,
          };
        });

        const documentUpdated = await this.invoicesDocumentRepository.createUpdateDocument(
          company,
          documentToUpdate,
          'update',
        );

        document = data.map((d) => {
          return {
            ...d,
            documentType: documentTypes.find((dt) => dt.id == d.documentType),
            isCurrentDocument: true,
            company: company,
          };
        });

        break;

      case 'update':
        const documentExist = await this.invoicesDocumentRepository.getDocumentsByIds(
          company,
          data.map((d) => d.id),
          'unused',
        );

        if (documentExist.length == 0) {
          throw new BadRequestException(
            'Los documentos seleccionados no existen o estan en uso',
          );
        }

        documentsNotExist = [];
        documentsToUpdate = [];
        for (const d of data) {
          if (documentExist.map((de) => de.id).includes(d.id)) {
            documentsToUpdate.push(d);
          } else {
            documentsNotExist.push(d);
          }
        }

        document = documentsToUpdate.map((d) => {
          return {
            ...d,
            documentType: documentTypes.find((dt) => dt.id == d.documentType),
          };
        });

        break;
    }

    const documentCreated = await this.invoicesDocumentRepository.createUpdateDocument(
      company,
      document,
      type,
    );
    let message = {};
    switch (type) {
      case 'create':
        message = {
          id: documentCreated.map((dr) => dr.id).join(','),
          message: 'Los documentos se han creado correctamente.',
        };
        break;
      case 'update':
        message = {
          message:
            documentsNotExist.length == 0
              ? 'Los documentos se han actualizado correctamente.'
              : `Se actualizaron los documentos con id:${documentsToUpdate
                  .map((dt) => dt.id)
                  .join(
                    ',',
                    ' ',
                  )}, y no se pudieron actualizar los documentos con id:${documentsNotExist
                  .map((dne) => dne.id)
                  .join(',', ' ')} porque no existe o esta en uso`,
        };
        break;
    }

    return message;
  }

  async getDocumentLayout(
    company: Company,
    id: string,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    const {
      documentLayout,
    } = await this.invoicesDocumentRepository.getSequenceAvailable(
      company,
      parseInt(id),
    );

    return new ResponseSingleDTO(
      plainToClass(InvoicesDocument, JSON.parse(documentLayout)),
    );
  }

  async createUpdateDocumentLayout(
    company: Company,
    id: number,
    data: DocumentLayoutDTO,
  ) {
    const document = await this.invoicesDocumentRepository.getSequenceAvailable(
      company,
      id,
    );

    await this.invoicesDocumentRepository.updateInvoiceDocument(
      document.id,
      { documentLayout: JSON.stringify(data) },
      company,
    );

    return {
      message: `La configuracion ha sido guardada correctamente.`,
    };
  }

  async updateDocumentStatus(
    id: string,
    company: Company,
    data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesDocumentRepository.getDocumentsByIds(
      company,
      [id],
      'all',
    );

    await this.invoicesDocumentRepository.updateInvoiceDocument(
      id,
      data,
      company,
    );
    return {
      message: 'El estado del documento se actualizo correctamente.',
    };
  }

  async generateReport(
    company: Company,
    filter: ReportFilterDTO,
  ): Promise<ResponseListDTO<Invoice>> {
    let documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes();
    const {
      startDate,
      endDate,
      documentType,
      customer,
      seller,
      zone,
      status,
      service,
    } = filter;
    if (documentType) {
      documentTypes = await this.invoicesDocumentTypeRepository.documentTypesByIds(
        [documentType],
      );
    }

    let params = {};
    params = { startDate, endDate };

    if (customer) {
      params = { ...params, customer };
    }
    if (seller) {
      params = { ...params, seller };
    }
    if (zone) {
      params = { ...params, zone };
    }
    if (status) {
      params = { ...params, status };
    }
    if (service) {
      params = { ...params, service };
    }
    const sales = await this.invoiceRepository.getInvoices(company, params);

    const report = documentTypes.map((dt) => {
      const documents = sales
        .filter((s) => s.documentType.id == dt.id)
        .map((d) => {
          return {
            customer: d.customerName,
            date: d.invoiceDate.split('-').reverse().join('/'),
            documentNumber: `${d.authorization} - ${d.sequence}`,
            status: { id: d.status.id, name: d.status.name },
            vGravada: d.subtotal,
            vNSujeta: d.ventasNoSujetas,
            vExenta: d.ventasExentas,
            iva: d.iva,
            ivaRetenido: d.ivaRetenido,
            total: d.ventaTotal,
          };
        });
      return {
        name: dt.name,
        code: dt.code,
        count: documents.length,
        documents,
        vGravadaTotal: documents
          .filter((d) => d.status.id != 3)
          .reduce((a, b) => a + b.vGravada, 0),
        vNSujetaTotal: documents
          .filter((d) => d.status.id != 3)
          .reduce((a, b) => a + b.vNSujeta, 0),
        vExentaTotal: documents
          .filter((d) => d.status.id != 3)
          .reduce((a, b) => a + b.vExenta, 0),
        ivaTotal: documents
          .filter((d) => d.status.id != 3)
          .reduce((a, b) => a + b.iva, 0),
        ivaRetenidoTotal: documents
          .filter((d) => d.status.id != 3)
          .reduce((a, b) => a + b.ivaRetenido, 0),
        totalTotal: documents
          .filter((d) => d.status.id != 3)
          .reduce((a, b) => a + b.total, 0),
      };
    });

    return new ResponseListDTO(plainToClass(Invoice, report));
  }
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
      [data.header.documentType],
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
      documentType[0],
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

  async updateInvoice(
    company: Company,
    id: string,
    data: InvoiceDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

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
    const invoicesPaymentCondition = await this.invoicesPaymentsConditionRepository.getInvoicePaymentCondition(
      data.header.invoicesPaymentsCondition,
      company,
    );

    const header = {
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
      ventaTotalText: numeroALetras(data.header.ventaTotal),
      invoiceDate: data.header.invoiceDate,
      paymentConditionName: invoicesPaymentCondition.name,
      sellerName: invoiceSeller.name,
      zoneName: invoiceSeller.invoicesZone.name,
      customerBranch: customerBranch,
      customer: customer,
      invoicesPaymentsCondition: invoicesPaymentCondition,
      invoicesSeller: invoiceSeller,
      invoicesZone: invoiceSeller.invoicesZone,
      customerType: customer.customerType,
      customerTypeNatural: customer.customerTypeNatural,
    };

    await this.invoiceRepository.updateInvoice(id, company, header);
    const ids = invoice.invoiceDetails.map((id) => id.id);
    await this.invoiceDetailRepository.deleteInvoiceDetail(ids);
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
        invoice: invoice,
      });
    }
    await this.invoiceDetailRepository.createInvoiceDetail(details);

    return {
      message: 'La venta se actualizo correctamente.',
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
