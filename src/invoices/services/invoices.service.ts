import { BadRequestException, Dependencies, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from '../../companies/entities/Company.entity';
import { CustomerRepository } from '../../customers/repositories/Customer.repository';
import { CustomerBranchRepository } from '../../customers/repositories/CustomerBranch.repository';
import { ServiceRepository } from '../../services/repositories/Service.repository';
import { ReportsDTO, ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../../_dtos/responseList.dto';
import { InvoiceDataDTO } from '../dtos/invoice-data.dto';
import { InvoiceFilterDTO } from '../dtos/invoice-filter.dto';
import { ReportFilterDTO } from '../dtos/invoice-report-filter.dto';
import { InvoiceReserveDataDTO } from '../dtos/invoice-reserve-data.dto';
import { Invoices } from '../entities/invoices.entity';
import { InvoicesDocumentTypes } from '../entities/invoices.documentTypes.entity';
import { InvoiceRepository } from '../repositories/invoices.repository';
import { InvoicesDetailsRepository } from '../repositories/invoices.details.repository';
import { InvoicesDocumentsRepository } from '../repositories/invoices.documents.repository';
import { InvoicesDocumentTypeRepository } from '../repositories/InvoicesDocumentType.repository';
import { InvoicesPaymentsConditionsRepository } from '../repositories/invoicesPaymentsConditions.repository';
import { InvoicesSellerRepository } from '../repositories/InvoicesSeller.repository';
import { InvoicesStatusRepository } from '../repositories/InvoicesStatus.repository';
import { InvoicesZoneRepository } from '../repositories/InvoicesZone.repository';
import { Branch } from '../../companies/entities/Branch.entity';
import { numeroALetras } from '../../_tools';
import { format, parseISO } from 'date-fns';
import { InvoicesEntriesRecurrency } from '../entities/InvoicesEntriesRecurrency.entity';
import { InvoicesEntriesRecurrencyRepository } from '../repositories/InvoiceEntriesRecurrency.repository';
import { AccountingCatalogRepository } from '../../entries/repositories/AccountingCatalog.repository';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/entities/User.entity';
import * as globals from '../../_tools/globals';
import { AccessRepository } from '../../auth/repositories/Access.repository';
import { CustomersService } from '../../customers/customers.service';
import { EntriesService } from '../../entries/entries.service';
import { ServicesService } from '../../services/services.service';
import { Cron } from '@nestjs/schedule';
import { SystemService } from '../../system/system.service';
import { InvoicesSettingService } from '../services/invoices.settings.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoicesDocumentTypeRepository)
    private invoicesDocumentTypeRepository: InvoicesDocumentTypeRepository,

    @InjectRepository(InvoicesStatusRepository)
    private invoiceStatusRepository: InvoicesStatusRepository,

    @InjectRepository(InvoicesZoneRepository)
    private invoicesZoneRepository: InvoicesZoneRepository,

    @InjectRepository(InvoicesPaymentsConditionsRepository)
    private invoicesPaymentsConditionRepository: InvoicesPaymentsConditionsRepository,

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

    @InjectRepository(InvoicesDetailsRepository)
    private invoiceDetailRepository: InvoicesDetailsRepository,

    @InjectRepository(InvoicesDocumentsRepository)
    private invoicesDocumentRepository: InvoicesDocumentsRepository,

    @InjectRepository(InvoicesEntriesRecurrencyRepository)
    private invoicesEntriesRecurrencyRepository: InvoicesEntriesRecurrencyRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    private authService: AuthService,
    private customerService: CustomersService,
    private entriesService: EntriesService,
    private serviceService: ServicesService,
    private invoiceSettingsService: InvoicesSettingService,

    @Inject(forwardRef(() => SystemService))
    private systemService: SystemService,

    @InjectRepository(AccessRepository)
    private accessRepository: AccessRepository,
  ) {}

  async getInvoicesEntriesRecurrencies(): Promise<{ data: InvoicesEntriesRecurrency[]; count: number }> {
    return this.invoicesEntriesRecurrencyRepository.getInvoicesEntriesRecurrencies();
  }
  async getInvoicesDocumentTypes(): Promise<{ data: InvoicesDocumentTypes[]; count: number }> {
    return this.invoicesDocumentTypeRepository.getInvoiceDocumentsType();
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

  async getInvoices(
    company: Company,
    filter: InvoiceFilterDTO,
  ): Promise<ResponseListDTO<Partial<Invoices>, number, number, number>> {
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

  async getInvoice(company: Company, id: string): Promise<ResponseSingleDTO<Invoices>> {
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

    return new ResponseSingleDTO(plainToClass(Invoices, invoice));
  }

  async createInvoice(company: Company, branch: Branch, data: InvoiceDataDTO, user: User): Promise<ResponseMinimalDTO> {
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
    await this.invoiceDetailRepository.createInvoicesDetail(details);

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

    if (await this.authService.hasModules([globals.entriesModuleId], user, branch, company)) {
      await this.invoiceRepository.updateInvoice([invoiceHeader.id], { createEntry: true });
    }
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
    await this.invoiceDetailRepository.deleteInvoicesDetails(ids);
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
    await this.invoiceDetailRepository.createInvoicesDetail(details);

    return {
      message: 'La venta se actualizo correctamente.',
    };
  }

  /**
   * Metodo utilizado para eliminar documentos de venta
   * @param company Compañia con la qu eesta logado el usuraio que invoca el metodo
   * @param id de la venta que se desea eliminar
   * @returns Returna mensaje de exito o de error en el caso que sea necesario
   */
  async deleteInvoice(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    const allowedStatuses = [1, 4];
    if (!allowedStatuses.includes(invoice.status.id)) {
      throw new BadRequestException(
        `La venta seleccionada no puede ser eliminada mientras tenga estado "${invoice.status.name.toUpperCase()}"`,
      );
    }

    const document = await this.invoicesDocumentRepository.getSequenceAvailable(company, invoice.documentType.id);
    if (invoice.status.id == 4) {
      if (parseInt(invoice.sequence) < document.current - 1) {
        throw new BadRequestException(
          'La venta seleccionada no puede ser eliminada, solo puede ser anulada ya que es menor que el ultimo correlativo ingresado.',
        );
      }
    } else if (document.current - 1 != parseInt(invoice.sequence)) {
      throw new BadRequestException(
        'La venta seleccionada no puede ser eliminada, solo puede ser anulada ya que no es el ultimo correlativo ingresado.',
      );
    }
    const detailsIds = invoice.invoiceDetails.map((id) => id.id);

    await this.invoiceDetailRepository.deleteInvoicesDetails(detailsIds);

    const result = await this.invoiceRepository.deleteInvoice(company, id, invoice);

    await this.invoicesDocumentRepository.updateInvoiceDocument(
      document.id,
      { current: document.current - 1 },
      company,
    );

    if (!result) {
      throw new BadRequestException('No se ha podido eliminar la venta, contacta con tu administrador.');
    }
    return {
      message: 'Se ha eliminado la venta correctamente',
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

  /**
   * Metodo utilizado para estructurrar la informacion necesaria para la creacion de partidas contables mediante el uso de cronjobs
   * @param companiesWithIntegrations Arreglo de compañias que tienen integraciones activas
   * @param recurrencyFrecuency Frecuency con la que se debe obtner las ventas
   * @returns REturna un arreglo con las partidas contables a crear separadas cada una de ellas por compañia
   */
  async prepareInvoicesForEntries(companiesWithIntegrations: string[], recurrencyFrecuency: number): Promise<any> {
    const invoicesForEntries = await this.invoiceRepository.getInvoicesForEntries(
      companiesWithIntegrations,
      recurrencyFrecuency,
    );

    const FCP = format(Date.now(), 'yyyy-MM-dd');

    const preparedInvoices = [];
    for (const invoice of invoicesForEntries) {
      const details = [];

      for (const i of invoice.invoices) {
        let accountingCatalog;
        if (i.invoicesPaymentsCondition.cashPayment) {
          accountingCatalog = (await this.invoiceSettingsService.getInvoicesIntegrations(i.company.id, 'entries'))
            .entries.cashPaymentAccountingCatalog;
        } else {
          accountingCatalog = (
            await this.customerService.getCustomerIntegration(i.customer.id, i.company, 'entries', 'cliente')
          ).entries.accountingCatalogCXC
            ? (await this.customerService.getCustomerIntegration(i.customer.id, i.company, 'entries')).entries
                .accountingCatalogCXC
            : (await this.customerService.getCustomerSettingIntegrations(i.company, 'entries', 'cliente')).entries
                .accountingCatalogCXC;
        }

        details.push({
          accountingCatalog,
          concept: `${i.documentType.code} ${i.authorization}${i.sequence} -  ${
            (await this.accountingCatalogRepository.getAccountingCatalog(accountingCatalog, i.company, false)).name
          }`,
          cargo: parseFloat(i.ventaTotal),
          abono: 0,
          order: invoice.invoices.indexOf(i) + 1,
          catalogName: (
            await this.accountingCatalogRepository.getAccountingCatalog(accountingCatalog, i.company, false)
          ).name,
          accountingEntry: null,
          company: i.company.id,
        });
        details.push({
          accountingCatalog: (await this.entriesService.getSettings(i.company, 'general')).data.accountingDebitCatalog,
          concept: `${i.documentType.code} ${i.authorization}${i.sequence} - Debito Fiscal`,
          cargo: 0,
          abono: parseFloat(i.iva),
          order: invoice.invoices.indexOf(i) + 2,
          catalogName: (
            await this.accountingCatalogRepository.getAccountingCatalog(
              (
                await this.entriesService.getSettings(i.company, 'general')
              ).data.accountingDebitCatalog as any as string,
              i.company,
              false,
            )
          ).name,
          accountingEntry: null,
          company: i.company.id,
        });

        if (
          (await this.invoiceSettingsService.getInvoicesIntegrations(i.company.id, 'entries')).entries.registerService
        ) {
          for (const id of i.invoiceDetails) {
            details.push({
              accountingCatalog: (await this.serviceService.getServiceIntegrations(i.company, id.service.id, 'entries'))
                .entries.accountingCatalogSales
                ? (await this.serviceService.getServiceIntegrations(i.company, id.service.id, 'entries')).entries
                    .accountingCatalogSales
                : (await this.serviceService.getServiceSettingIntegrations(i.company, 'entries')).entries
                    .accountingCatalogSales,

              concept: `${i.documentType.code} ${i.authorization}${i.sequence} - VENTA`,
              cargo: 0,
              abono: id.service.incTax
                ? (parseFloat(id.unitPrice) / 1.13) * parseFloat(id.quantity)
                : parseFloat(id.quantity) * parseFloat(id.unitPrice),
              order: invoice.invoices.indexOf(i) + 3,
              catalogName: (
                await this.accountingCatalogRepository.getAccountingCatalog(
                  (
                    await this.serviceService.getServiceIntegrations(i.company, id.service.id, 'entries')
                  ).entries.accountingCatalogSales
                    ? (
                        await this.serviceService.getServiceIntegrations(i.company, id.service.id, 'entries')
                      ).entries.accountingCatalogSales
                    : (
                        await this.serviceService.getServiceSettingIntegrations(i.company, 'entries')
                      ).entries.accountingCatalogSales,
                  i.company,
                  false,
                )
              ).name,
              accountingEntry: null,
              company: i.company.id,
            });
          }
        } else {
          details.push({
            accountingCatalog: (await this.customerService.getCustomerIntegration(i.customer.id, i.company, 'entries'))
              .entries.accountingCatalogSales
              ? (await this.customerService.getCustomerIntegration(i.customer.id, i.company, 'entries')).entries
                  .accountingCatalogSales
              : (await this.customerService.getCustomerSettingIntegrations(i.company, 'entries')).entries
                  .accountingCatalogSales,
            concept: `${i.documentType.code} ${i.authorization}${i.sequence} - VENTA`,
            cargo: 0,
            abono: parseFloat(i.sum),
            order: invoice.invoices.indexOf(i) + 3,
            catalogName: (
              await this.accountingCatalogRepository.getAccountingCatalog(
                (
                  await this.customerService.getCustomerIntegration(i.customer.id, i.company, 'entries')
                ).entries.accountingCatalogSales
                  ? (
                      await this.customerService.getCustomerIntegration(i.customer.id, i.company, 'entries')
                    ).entries.accountingCatalogSales
                  : (
                      await this.customerService.getCustomerSettingIntegrations(i.company, 'entries')
                    ).entries.accountingCatalogSales,
                i.company,
                false,
              )
            ).name,
            accountingEntry: null,
            company: i.company.id,
          });
        }
      }

      preparedInvoices.push({
        company: invoice.invoices[0].company.id,
        entry: {
          header: {
            title: `Partida de ventas correspondiente a ${format(parseISO(FCP), 'dd/MM/yyyy')}`,
            date: FCP,
            squared:
              invoice.invoices.reduce((a, b) => a + parseFloat(b.ventaTotal), 0) ==
              invoice.invoices.reduce((a, b) => a + parseFloat(b.iva), 0) +
                invoice.invoices.reduce((a, b) => a + parseFloat(b.sum), 0),
            accounted: false,
            accountingEntryType: 4,
            origin: globals.invoiceModuleId,
          },
          details,
          invoices: invoice.invoices.map((i) => i.id),
        },
      });
    }

    return preparedInvoices;
  }

  /**
   * Metodo uitlizado para crear automaticamente las partidas contables mediante el uso de cronjobs el cual corre
   * todos los dias alas 00:00:00
   * @returns
   */
  @Cron('0 0 0 * * *', {
    name: 'createSheduledEntriesEntries',
    timeZone: 'America/El_Salvador',
  })
  async createSheduledEntries(): Promise<void> {
    const companies = await this.accessRepository.getCompaniesWithIntegrations(
      globals.invoiceModuleId,
      globals.entriesModuleId,
    );

    const companiesWithActiveIntegrations = [];
    for (const c of companies) {
      if (
        await this.systemService.hasIntegration(
          c,
          globals.invoiceModuleId,
          globals.entriesModuleId,
          companies.map((c) => c.id),
        )
      ) {
        companiesWithActiveIntegrations.push(c);
      }
    }

    const recurrencies = await this.invoicesEntriesRecurrencyRepository.getInvoicesEntriesRecurrencies();

    const entries = [];
    for (const r of recurrencies.data) {
      entries.push(
        ...(await this.prepareInvoicesForEntries(
          companiesWithActiveIntegrations.map((c) => c.id),
          r.id,
        )),
      );
    }

    if (entries.length == 0) {
      return;
    }

    for (const c of companiesWithActiveIntegrations) {
      const entryToCreate = entries.find((e) => e.company == c.id).entry;

      const createdEntry = await this.entriesService.createUpdateEntry(
        c,
        entryToCreate.header,
        entryToCreate.details,
        'create',
      );

      await this.invoiceRepository.updateInvoice(entryToCreate.invoices, { accountingEntry: createdEntry.id });
    }
  }
}
@Dependencies(InvoicesService)
export class InvoicesDependendService {
  constructor(invoicesServices) {
    invoicesServices = invoicesServices;
  }
}
