import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from '../companies/entities/Company.entity';
import { CustomerRepository } from '../customers/repositories/Customer.repository';
import { CustomerBranchRepository } from '../customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from '../services/repositories/Service.repository';
import { FilterDTO } from '../_dtos/filter.dto';
import { ReportsDTO, ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { InvoiceDataDTO } from './dtos/invoice-data.dto';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { ReportFilterDTO } from './dtos/invoice-report-filter.dto';
import { InvoiceReserveDataDTO } from './dtos/invoice-reserve-data.dto';
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
import { InvoiceDocumentUpdateDTO } from './dtos/documents/invoice-document-update.dto';
import { InvoiceDocumentLayoutDTO } from './dtos/documents/invoice-document-layout.dto';
import { Branch } from '../companies/entities/Branch.entity';
import { numeroALetras } from '../_tools';
import { InvoiceZonesDataDTO } from './dtos/zones/invoice-data.dto';
import { ActiveValidateDTO } from './dtos/invoice-active.dto';
import { InvoicePaymentConditionDataDTO } from './dtos/payment-condition/invoice-data.dto';
import { InvoiceSellerDataDTO } from './dtos/sellers/invoice-data.dto';
import { format, parseISO } from 'date-fns';
import { DocumentFilterDTO } from './dtos/documents/invoice-documnet-filter.dto';
import { InvoicesEntriesRecurrency } from './entities/InvoicesEntriesRecurrency.entity';
import { InvoicesEntriesRecurrencyRepository } from './repositories/InvoiceEntriesRecurrency.repository';
import { InvoicesIntegrationsRepository } from './repositories/InvoicesIntegration.repository';
import { ModuleRepository } from 'src/system/repositories/Module.repository';
import { InvoiceIntegrationBaseDTO } from './dtos/invoice-integration-base.dto';
import { AccountingCatalogRepository } from 'src/entries/repositories/AccountingCatalog.repository';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoicesDocumentTypeRepository)
    private invoicesDocumentTypeRepository: InvoicesDocumentTypeRepository,

    @InjectRepository(InvoicesStatusRepository)
    private invoiceStatusRepository: InvoicesStatusRepository,

    @InjectRepository(InvoicesZoneRepository)
    private invoicesZoneRepository: InvoicesZoneRepository,

    @InjectRepository(InvoicesPaymentsConditionRepository)
    private invoicesPaymentsConditionRepository: InvoicesPaymentsConditionRepository,

    @InjectRepository(InvoicesSellerRepository)
    private invoiceSellerRepository: InvoicesSellerRepository,

    @InjectRepository(InvoiceRepository)
    private invoiceRepository: InvoiceRepository,

    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,

    @InjectRepository(CustomerBranchRepository)
    private customerBranchRepository: CustomerBranchRepository,

    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,

    @InjectRepository(InvoiceDetailRepository)
    private invoiceDetailRepository: InvoiceDetailRepository,

    @InjectRepository(InvoicesDocumentRepository)
    private invoicesDocumentRepository: InvoicesDocumentRepository,

    @InjectRepository(InvoicesEntriesRecurrencyRepository)
    private invoicesEntriesRecurrencyRepository: InvoicesEntriesRecurrencyRepository,

    @InjectRepository(InvoicesIntegrationsRepository)
    private invoicesIntegrationsRepository: InvoicesIntegrationsRepository,

    @InjectRepository(ModuleRepository)
    private moduleRepository: ModuleRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,
  ) {}

  async getInvoicesEntriesRecurrencies(): Promise<{ data: InvoicesEntriesRecurrency[]; count: number }> {
    return this.invoicesEntriesRecurrencyRepository.getInvoicesEntriesRecurrencies();
  }
  async getInvoicesDocumentTypes(): Promise<{ data: InvoicesDocumentType[]; count: number }> {
    return this.invoicesDocumentTypeRepository.getInvoiceDocumentsType();
  }

  async getInvoicesStatuses(): Promise<{ data: InvoicesStatus[]; count: number }> {
    return this.invoiceStatusRepository.getInvoicesStatuses();
  }

  async updateInvoicesStatus(company: Company, id: string, type: string): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    let status: InvoicesStatus;
    let statuses = [];

    switch (type) {
      case 'void':
        status = await this.invoiceStatusRepository.getInvoicesStatus(3);
        statuses = [1, 2];
        break;
      case 'printed':
        status = await this.invoiceStatusRepository.getInvoicesStatus(2);
        statuses = [1, 2];
        break;
      case 'paid':
        status = await this.invoiceStatusRepository.getInvoicesStatus(5);
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
        status = await this.invoiceStatusRepository.getInvoicesStatus(newStatus);
        statuses = [2, 3, 5];
        break;
    }

    if (!statuses.includes(invoice.status.id)) {
      throw new BadRequestException('La venta tiene un estado que no permite esta acción.');
    }

    await this.invoiceRepository.updateInvoice([id], { status: status.id });

    return {
      message:
        type == 'reverse'
          ? `La venta se revertio correctamente, ha sido marcada como ${status.name.toLowerCase()}.`
          : `La venta ha sido marcada como ${status.name.toLowerCase()} correctamente.`,
    };
  }

  async getInvoicesZones(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<{ data: InvoicesZone[]; count: number }> {
    return this.invoicesZoneRepository.getInvoicesZones(company, filter);
  }

  async createInvoicesZone(company: Company, data: InvoiceZonesDataDTO): Promise<ResponseMinimalDTO> {
    const invoiceZone = await this.invoicesZoneRepository.createInvoicesZone(company, data);
    return {
      id: invoiceZone.id,
      message: 'La zona se creo correctamente.',
    };
  }

  async updateInvoicesZone(
    id: string,
    company: Company,
    data: InvoiceZonesDataDTO | ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesZoneRepository.getInvoicesZone(company, id);
    await this.invoicesZoneRepository.updateInvoicesZone(id, company, data);
    return {
      message: 'La zona se actualizo correctamente',
    };
  }

  async deleteInvoicesZone(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoicesZoneRepository.getInvoicesZone(company, id);
    const result = await this.invoicesZoneRepository.deleteInvoicesZone(company, id);
    return {
      message: result ? 'Se ha eliminado la zona correctamente' : 'No se ha podido eliminar zona',
    };
  }

  async getInvoicesPaymentConditions(
    company: Company,
    filter: FilterDTO,
  ): Promise<{ data: InvoicesPaymentsCondition[]; count: number }> {
    return this.invoicesPaymentsConditionRepository.getInvoicesPaymentConditions(company, filter);
  }

  async createInvoicesPaymentCondition(
    company: Company,
    data: InvoicePaymentConditionDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const invoicePayment = await this.invoicesPaymentsConditionRepository.createInvoicesPaymentCondition(company, data);
    return {
      id: invoicePayment.id,
      message: 'La condicion de pago se creo correctamente.',
    };
  }

  async updateInvoicesPaymentCondition(
    id: string,
    company: Company,
    data: InvoicePaymentConditionDataDTO | ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesPaymentsConditionRepository.getInvoicesPaymentCondition(id, company);

    await this.invoicesPaymentsConditionRepository.updateInvoicesPaymentCondition(id, company, data);
    return {
      message: 'La condicion de pago se actualizo correctamente',
    };
  }

  async deleteInvoicesPaymentCondition(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoicesPaymentsConditionRepository.getInvoicesPaymentCondition(id, company);
    const result = await this.invoicesPaymentsConditionRepository.deleteInvoicesPaymentCondition(company, id);
    return {
      message: result
        ? 'Se ha eliminado la condicion de pago correctamente correctamente'
        : 'No se ha podido eliminar condicion de pago correctamente',
    };
  }

  async getInvoicesSellers(company: Company, filter: FilterDTO): Promise<{ data: InvoicesSeller[]; count: number }> {
    return this.invoiceSellerRepository.getInvoicesSellers(company, filter);
  }

  async createInvoicesSeller(company: Company, data: InvoiceSellerDataDTO): Promise<ResponseMinimalDTO> {
    const invoicesZone = await this.invoicesZoneRepository.getInvoicesZone(
      company,
      data.invoicesZone as unknown as string,
    );
    const seller = await this.invoiceSellerRepository.createInvoicesSeller(company, { ...data, invoicesZone });
    return {
      id: seller.id,
      message: 'El vendedor se ha creado correctamente',
    };
  }

  async updateInvoicesSeller(
    id: string,
    company: Company,
    data: InvoiceSellerDataDTO | ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoiceSellerRepository.getInvoicesSeller(company, id);
    await this.invoiceSellerRepository.updateInvoicesSeller(id, company, data);

    return {
      message: 'El vendedor se actualizo correctamente.',
    };
  }

  async deleteInvoicesSeller(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoiceSellerRepository.getInvoicesSeller(company, id);

    const result = await this.invoiceSellerRepository.deleteInvoicesSeller(company, id);

    return {
      message: result ? 'Se ha eliminado el vendedor correctamente' : 'No se ha podido eliminar el vendedor',
    };
  }

  async getDocuments(
    company: Company,
    filter: DocumentFilterDTO,
  ): Promise<ResponseListDTO<any, number, number, number>> {
    const existingDocuments = await this.invoicesDocumentRepository.getInvoicesDocuments(company, filter);
    const documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes();

    const documents = documentTypes.map((dt) => {
      const found = existingDocuments.find((d) => d.documentType.id == dt.id);

      if (found) {
        delete found.documentLayout;
        delete found.layout;
      }
      return found
        ? { ...found }
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

    return { data: documents, count: documents.length, page: filter.page, limit: filter.limit };
  }

  async getDocument(company: Company, id: string): Promise<ResponseSingleDTO<InvoicesDocument>> {
    const document = await this.invoicesDocumentRepository.getDocumentsByIds(company, [id]);
    return new ResponseSingleDTO(plainToClass(InvoicesDocument, document[0]));
  }

  async createUpdateDocument(company: Company, data: InvoiceDocumentUpdateDTO[]): Promise<ResponseMinimalDTO> {
    const documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes(
      data.map((d) => d.documentType as unknown as number),
    );

    let documentsToProcessUpdate = [];
    let documentsToProcessCreate = [];

    const documentExist = await this.invoicesDocumentRepository.getDocumentsByIds(
      company,
      data.filter((d) => d.id).map((d) => d.id),
      'unused',
    );

    if (documentExist.length > 0) {
      documentsToProcessUpdate = data
        .filter((d) => documentExist.map((de) => de.id).includes(d.id))
        .map((d) => {
          return {
            ...d,
            documentType: documentTypes.find((dt) => dt.id == (d.documentType as unknown as number)),
          };
        });
    }

    // Obtiene los documentos ya existentes de los tipos que se van a crear
    let documents = await this.invoicesDocumentRepository.getInvoicesDocuments(company);

    documents = documents.filter((d) => documentTypes.map((dt) => dt.id).includes(d.documentType.id));
    const documentsToDisable = documents.map((d) => {
      return {
        ...d,
        isCurrentDocument: false,
        active: false,
      };
    });

    // Deshabilita los documentos
    await this.invoicesDocumentRepository.createUpdateDocument(company, documentsToDisable, 'update');

    documentsToProcessCreate = data
      .filter((d) => !documentExist.map((de) => de.id).includes(d.id))
      .map((d) => {
        delete d.id;
        return {
          ...d,
          documentType: documentTypes.find((dt) => dt.id == (d.documentType as unknown as number)),
          isCurrentDocument: true,
          company: company,
        };
      });

    const completedUpdate = await this.invoicesDocumentRepository.createUpdateDocument(
      company,
      documentsToProcessUpdate,
      'update',
    );
    const completedCreate = await this.invoicesDocumentRepository.createUpdateDocument(
      company,
      documentsToProcessCreate,
      'create',
    );

    let message = '';
    message =
      completedCreate.length > 0 && completedUpdate.length > 0
        ? 'Se han creado y actulizado los documentos correctamente'
        : completedCreate.length > 0
        ? 'Se han creado los documentos correctamente'
        : completedUpdate.length > 0
        ? 'Se han actulizado los documentos correctamente'
        : 'No se han podido actualizar o crear los documentos.';

    return {
      ids: completedCreate.length > 0 ? completedCreate.map((c) => c.id) : completedUpdate.map((c) => c.id),
      message,
    };
  }

  async getDocumentLayout(company: Company, id: number): Promise<ResponseSingleDTO<InvoicesDocument>> {
    const { documentLayout } = await this.invoicesDocumentRepository.getSequenceAvailable(company, id);
    return new ResponseSingleDTO(plainToClass(InvoicesDocument, documentLayout));
  }

  async updateDocumentStatus(id: string, company: Company, data: ActiveValidateDTO): Promise<ResponseMinimalDTO> {
    await this.invoicesDocumentRepository.getDocumentsByIds(company, [id]);
    await this.invoicesDocumentRepository.updateInvoiceDocument(id, data, company);
    return {
      message: 'El estado del documento se actualizo correctamente.',
    };
  }

  async createUpdateDocumentLayout(company: Company, id: number, data: InvoiceDocumentLayoutDTO) {
    const document = await this.invoicesDocumentRepository.getSequenceAvailable(company, id);
    await this.invoicesDocumentRepository.updateInvoiceDocument(document.id, { documentLayout: data }, company);
    return {
      message: `La configuracion ha sido guardada correctamente.`,
    };
  }

  async generateReport(company: Company, filter: ReportFilterDTO): Promise<ReportsDTO> {
    let documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes();
    const { startDate, endDate, documentType, customer, seller, zone, status, service } = filter;
    if (documentType) {
      documentTypes = await this.invoicesDocumentTypeRepository.documentTypesByIds([documentType]);
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

    const invoices = documentTypes.map((dt) => {
      const documents = sales.data
        .filter((s) => s.documentType.id == dt.id)
        .map((d) => {
          return {
            customer: d.customerName,

            date: d.invoiceDate ? format(new Date(d.invoiceDate), 'dd/MM/yyyy') : null,
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
        vGravadaTotal: documents.filter((d) => d.status.id != 3).reduce((a, b) => a + b.vGravada, 0),
        vNSujetaTotal: documents.filter((d) => d.status.id != 3).reduce((a, b) => a + b.vNSujeta, 0),
        vExentaTotal: documents.filter((d) => d.status.id != 3).reduce((a, b) => a + b.vExenta, 0),
        ivaTotal: documents.filter((d) => d.status.id != 3).reduce((a, b) => a + b.iva, 0),
        ivaRetenidoTotal: documents.filter((d) => d.status.id != 3).reduce((a, b) => a + b.ivaRetenido, 0),
        totalTotal: documents.filter((d) => d.status.id != 3).reduce((a, b) => a + b.total, 0),
      };
    });

    const report = {
      company: { name: company.name, nit: company.nit, nrc: company.nrc },
      name: `DETALLE DE VENTAS EN EL PERIODO DEL ${format(parseISO(startDate), 'dd/MM/yyyy')} AL ${format(
        parseISO(endDate),
        'dd/MM/yyyy',
      )}`,
      invoices,
    };

    return report;
  }

  async generateReportInvoiceList(company: Company, filter: ReportFilterDTO): Promise<ReportsDTO> {
    const { startDate, endDate, documentType, customer } = filter;

    let params = {};
    params = { startDate, endDate };

    if (customer) {
      params = { ...params, customer };
    }
    if (documentType) {
      params = { ...params, documentType };
    }

    const sales = await this.invoiceRepository.getInvoices(company, params);

    const invoices = sales.data.map((d) => {
      return {
        customer: d.customerName,
        code: d.documentType.code,
        date: d.invoiceDate ? format(new Date(d.invoiceDate), 'dd/MM/yyyy') : null,
        documentNumber: `${d.authorization} - ${d.sequence}`,
        total: d.ventaTotal,
      };
    });

    const report = {
      company: { name: company.name, nit: company.nit, nrc: company.nrc },
      name: `LISTADO DE VENTAS EN EL PERIODO DEL ${format(parseISO(startDate), 'dd/MM/yyyy')} AL ${format(
        parseISO(endDate),
        'dd/MM/yyyy',
      )}`,
      invoices,
    };

    return report;
  }

  /**
   * Metodo para estructurar y validar los campos de configuración que se muestran en cada una
   * de las integraciones con otros modulos
   * @param company --Compañia con la que esta logado el usuario que solicita el metodo
   * @returns las configuraciones almacenadas de las integraciones con los diferentes modulos
   */
  async getInvoicesIntegrations(company: Company, integratedModule: string): Promise<ResponseMinimalDTO> {
    const settings = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
    switch (integratedModule) {
      case 'entries':
        const modules = await this.moduleRepository.getModules();

        const filteredModules = [...new Set(settings.map((s) => s.module.id))];

        const foundModules = modules.filter((m) => filteredModules.includes(m.id));

        const integrations = {};
        for (const f of foundModules) {
          const values = settings
            .filter((s) => filteredModules.includes(s.module.id))
            .map((s) => {
              return {
                metaKey: s.metaKey,
                metaValue: s.metaValue,
              };
            });

          const data = {};
          for (const v of values) {
            if (
              v.metaKey == 'registerService' ||
              v.metaKey == 'activeIntegration' ||
              v.metaKey == 'automaticIntegration'
            ) {
              data[v.metaKey] = v.metaValue == 'true' ? true : false;
            } else if (v.metaKey == 'recurencyFrecuency') {
              data[v.metaKey] = parseInt(v.metaValue);
            } else {
              data[v.metaKey] = v.metaValue;
            }
          }

          integrations[f.shortName] = data;
        }
        return Object.keys(integrations).length > 0
          ? integrations
          : {
              entries: {
                cashPaymentAccountingCatalog: null,
                automaticIntegration: false,
                activeIntegration: false,
                registerService: false,
                recurencyFrecuency: null,
              },
            };
    }
  }

  /**
   * Metodo utilizado para estructutrear la data necesaria para creear o actulizar los registros en configuraciones
   * de intgraciones con otros modulos
   * @param company compañia con la que esta logado el ususario que invoca el metodo
   * @param data Campos requeridos para crear las configuraciones necesarias
   * @param integratedModule modulo al que se desean guarar configuraciones
   * @returns Retorna el mensaje de exito o error notificando cualquiera de los casos
   */
  async upsertInvoicesIntegrations(
    company: Company,
    data: Partial<InvoiceIntegrationBaseDTO>,
    integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    let settings = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
    const setting = [];

    switch (integratedModule) {
      case 'entries':
        await this.invoicesEntriesRecurrencyRepository.getRecurrency(data.recurrencyFrecuency as number);

        await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.cashPaymentAccountingCatalog, company);
        settings = settings.filter((s) => s.module.id == 'a98b98e6-b2d5-42a3-853d-9516f64eade8');
        const activeIntegration = settings.find((s) => s.metaKey == 'activeIntegration');
        if (activeIntegration ? activeIntegration.metaValue == 'false' : true) {
          throw new BadRequestException(
            'No se pueden actulizar las configuraciones, porque esta se encuentra inactiva.',
          );
        }
        const cashPaymentAccountingCatalog = settings.find((s) => s.metaKey == 'cashPaymentAccountingCatalog');
        const automaticIntegration = settings.find((s) => s.metaKey == 'automaticIntegration');
        const registerService = settings.find((s) => s.metaKey == 'registerService');
        const recurencyFrecuency = settings.find((s) => s.metaKey == 'recurencyFrecuency');
        const recurrencyOption = settings.find((s) => s.metaKey == 'recurrencyOption');

        if (!cashPaymentAccountingCatalog) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'cashPaymentAccountingCatalog',
            metaValue: data.cashPaymentAccountingCatalog,
          });
        } else {
          setting.push({ ...cashPaymentAccountingCatalog, metaValue: data.cashPaymentAccountingCatalog });
        }

        if (!automaticIntegration) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'automaticIntegration',
            metaValue: `${data.automaticIntegration}`,
          });
        } else {
          setting.push({ ...automaticIntegration, metaValue: `${data.automaticIntegration}` });
        }
        if (!registerService) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'registerService',
            metaValue: `${data.registerService}`,
          });
        } else {
          setting.push({ ...registerService, metaValue: `${data.registerService}` });
        }
        if (!recurencyFrecuency) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'recurencyFrecuency',
            metaValue: `${data.recurrencyFrecuency}`,
          });
        } else {
          setting.push({ ...recurencyFrecuency, metaValue: `${data.recurrencyFrecuency}` });
        }
        if (!recurrencyOption) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'recurrencyOption',
            metaValue: data.recurrencyOption,
          });
        } else {
          setting.push({ ...recurrencyOption, metaValue: data.recurrencyOption });
        }
        break;
    }

    await this.invoicesIntegrationsRepository.upsertInvoicesIntegrations(setting);
    return {
      message: 'La integración ha sido actualizada correctamente.',
    };
  }

  async updateInvoicesIntegrationsActive(
    company: Company,
    data: Partial<InvoiceIntegrationBaseDTO>,
    integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    const settings = await this.invoicesIntegrationsRepository.getInvoicesIntegrations(company);
    const setting = [];

    switch (integratedModule) {
      case 'entries':
        await this.invoicesEntriesRecurrencyRepository.getRecurrency(data.recurrencyFrecuency as number);

        const activeIntegration = settings.find(
          (s) => s.metaKey == 'activeIntegration' && s.module.id == 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
        );
        if (!activeIntegration) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'activeIntegration',
            metaValue: 'true',
          });
        } else {
          setting.push({ ...activeIntegration, metaValue: `${data.activeIntegration}` });
        }

        break;
    }

    await this.invoicesIntegrationsRepository.upsertInvoicesIntegrations(setting);
    return {
      message: 'La integración ha sido actualizada correctamente.',
    };
  }

  async getInvoices(
    company: Company,
    filter: InvoiceFilterDTO,
  ): Promise<ResponseListDTO<Partial<Invoice>, number, number, number>> {
    const { data, count } = await this.invoiceRepository.getInvoices(company, filter);

    const sales = data.map((i) => {
      return {
        id: i.id,
        authorization: i.authorization,
        sequence: i.sequence,
        invoiceDate: i.invoiceDate ? format(new Date(i.invoiceDate), 'dd/MM/yyyy') : null,
        customerName: i.customerName,
        ventaTotal: i.ventaTotal,
        documentType: i.documentType,
        status: i.status,
        invoiceRawDate: i.invoiceDate,
      };
    });

    return {
      data: sales,
      count,
      page: filter.page,
      limit: filter.limit,
    };
  }

  async getInvoice(company: Company, id: string): Promise<ResponseSingleDTO<Invoice>> {
    const invoiceAll = await this.invoiceRepository.getInvoice(company, id);

    let details = [];
    if (invoiceAll.status.id != 4) {
      if (invoiceAll.origin == '53a36e54-bab2-4824-9e43-b40efab8bab9') {
        details = invoiceAll.invoiceDetails;
        delete invoiceAll.invoiceDetails;
        delete invoiceAll.invoicesPaymentsCondition;
        delete invoiceAll.invoicesSeller;
        delete invoiceAll.invoicesZone;
      } else if (invoiceAll.invoiceDetails[0].service) {
        details = invoiceAll.invoiceDetails.map((d) => {
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
      }
    }

    const invoice = {
      ...invoiceAll,
      invoiceRawDate: invoiceAll.invoiceDate,
      invoiceDate: format(new Date(invoiceAll.invoiceDate), 'dd/MM/yyyy'),
      details,
      customer: invoiceAll.customer
        ? {
            id: invoiceAll.customer.id,
            name: invoiceAll.customer.name,
          }
        : null,
      customerBranch: invoiceAll.customerBranch
        ? {
            id: invoiceAll.customerBranch.id,
            name: invoiceAll.customerBranch.name,
          }
        : null,
    };

    delete invoiceAll.customerBranch;
    delete invoiceAll.customer;

    return new ResponseSingleDTO(plainToClass(Invoice, invoice));
  }

  async createInvoice(company: Company, branch: Branch, data: InvoiceDataDTO): Promise<ResponseMinimalDTO> {
    const customer = await this.customerRepository.getCustomer(data.header.customer, company, 'cliente');
    const customerBranch = await this.customerBranchRepository.getCustomerCustomerBranch(
      data.header.customerBranch,
      'cliente',
      customer.id,
    );
    const invoiceSeller = await this.invoiceSellerRepository.getInvoicesSeller(company, data.header.invoicesSeller);
    const invoiceStatus = await this.invoiceStatusRepository.getInvoicesStatus(1);
    const invoicesPaymentCondition = await this.invoicesPaymentsConditionRepository.getInvoicesPaymentCondition(
      data.header.invoicesPaymentsCondition,
      company,
    );
    const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes([data.header.documentType]);

    const allInvoicesReserved = await this.invoiceRepository.getInvoices(company, {
      status: 4,
      documentType: data.header.documentType,
      order: 'ascending',
      prop: 'sequence',
    });

    const document = await this.invoicesDocumentRepository.getSequenceAvailable(
      company,
      data.header.documentType,
      allInvoicesReserved.data.map((ir) => parseInt(ir.sequence)),
    );

    if (document.used == false) {
      await this.invoicesDocumentRepository.updateInvoiceDocument(document.id, { used: true }, company);
    }

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

    if (data.header.sequence != invoiceHeader.sequence) {
      message = `El numero de secuencia asignado fué: ${invoiceHeader.sequence}`;
    }

    const details = [];
    for (const detail of data.details) {
      const service = await this.serviceRepository.getService(company, detail.service as any as string);
      details.push({
        ...detail,
        service,
        sellingType: service.sellingType,
        invoice: invoiceHeader,
      });
    }
    await this.invoiceDetailRepository.createInvoiceDetail(details);

    let nextSequence = parseInt(invoiceHeader.sequence) + 1;
    if (allInvoicesReserved.data.map((ir) => parseInt(ir.sequence)).includes(nextSequence)) {
      for (const is of allInvoicesReserved.data.map((ir) => parseInt(ir.sequence))) {
        for (let s = nextSequence; s <= document.final; s++) {
          if (s != is) {
            nextSequence = s;
            s = document.final;
          }
        }
      }
    }
    await this.invoicesDocumentRepository.updateInvoiceDocument(document.id, { current: nextSequence }, company);

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
    if (data.sequenceFrom > data.sequenceTo) {
      throw new BadRequestException('El primer número de correlativo no puede ser mayor que el segundo.');
    }
    const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes([data.documentType]);
    const { authorization } = await this.invoicesDocumentRepository.getSequenceAvailable(company, data.documentType);
    if (authorization != data.authorization) {
      throw new BadRequestException(
        'La autorización a la que pertenece el documento seleccionado no coincide, contacta con tu administrador.',
      );
    }

    const invoiceStatus = await this.invoiceStatusRepository.getInvoicesStatus(4);
    const document = await this.invoicesDocumentRepository.getSequenceAvailable(company, data.documentType);
    if (data.sequenceFrom < document.current || data.sequenceTo > document.final) {
      throw new BadRequestException(
        `El numero de sequencia debe ser mayor o igual a ${document.current} y menor o igual a ${document.final}`,
      );
    }
    const allInvoicesReserved = await this.invoiceRepository.getInvoices(company, {
      status: 4,
      documentType: data.documentType,
    });

    const sequence = [];
    for (let s = data.sequenceFrom; s <= data.sequenceTo; s++) {
      sequence.push(s);
    }

    const invoicesSequence = allInvoicesReserved.data.map((is) => parseInt(is.sequence));
    const alreadyReserved = invoicesSequence.filter((is) => sequence.includes(is));
    const sequenceToReserve = sequence.filter((s) => !alreadyReserved.includes(s));

    const invoiceValues = sequenceToReserve.map((sr) => {
      return {
        authorization: document.authorization,
        sequence: sr,
        company: company,
        documentType: documentType[0].id,
        status: invoiceStatus,
      };
    });

    await this.invoiceRepository.createReserveInvoice(company, branch, invoiceValues);

    if (data.sequenceFrom == document.current) {
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
          ? `Los documentos con sequencia ${sequenceToReserve.join(', ')} han sido reservados correctamente.`
          : `Los documentos con secuencia ${alreadyReserved.join(', ')} ya estan reservados`,
    };
  }

  async updateInvoice(company: Company, id: string, data: InvoiceDataDTO): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    const customer = await this.customerRepository.getCustomer(data.header.customer, company, 'cliente');
    const customerBranch = await this.customerBranchRepository.getCustomerCustomerBranch(
      data.header.customerBranch,
      'cliente',
      customer.id,
    );
    const invoiceSeller = await this.invoiceSellerRepository.getInvoicesSeller(company, data.header.invoicesSeller);
    const invoicesPaymentCondition = await this.invoicesPaymentsConditionRepository.getInvoicesPaymentCondition(
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
      subtotal: data.header.subtotal,
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
      status: data.header.status,
    };

    await this.invoiceRepository.updateInvoice([id], header);
    const ids = invoice.invoiceDetails.map((id) => id.id);
    await this.invoiceDetailRepository.deleteInvoiceDetail(ids);
    const details = [];
    for (const detail of data.details) {
      const service = await this.serviceRepository.getService(company, detail.service as any as string);
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

  async deleteInvoice(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    const allowedStatuses = [1];
    if (!allowedStatuses.includes(invoice.status.id)) {
      throw new BadRequestException(
        `La venta seleccionada no puede ser eliminada mientras tenga estado "${invoice.status.name.toUpperCase()}"`,
      );
    }

    const document = await this.invoicesDocumentRepository.getSequenceAvailable(company, invoice.documentType.id);
    if (document.current - 1 != parseInt(invoice.sequence)) {
      throw new BadRequestException(
        'La venta seleccionada no puede ser eliminada, solo puede ser anulada ya que no es el ultimo correlativo ingresado.',
      );
    }
    const detailsIds = invoice.invoiceDetails.map((id) => id.id);

    await this.invoiceDetailRepository.deleteInvoiceDetail(detailsIds);

    const result = await this.invoiceRepository.deleteInvoice(company, id, invoice);

    await this.invoicesDocumentRepository.updateInvoiceDocument(
      document.id,
      { current: document.current - 1 },
      company,
    );

    return {
      message: result ? 'Se ha eliminado la venta correctamente' : 'No se ha podido eliminar venta',
    };
  }

  /**
   *
   * @param invoiceId --El id de la venta que se desea consultar
   * @param company  --El id de la compañia a la que pertenece la venta y el usuario logado a ala hora de invocar el metodo
   * @returns   * Retorna un objeto con la propiedad {createEntry: boolean, entryId}
   * Dicho metodo sirve para
   */
  async saleHasIntegration(invoiceId: string, company: Company): Promise<boolean> {
    const invoice = await this.invoiceRepository.getInvoice(company, invoiceId);
    if (invoice.createEntry && invoice.accountingEntry.id) {
      return true;
    }
    return false;
  }
}
