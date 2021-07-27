import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { Invoices } from 'src/invoices/entities/Invoices.entity';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { InvoiceDetailRepository } from 'src/invoices/repositories/InvoiceDetail.repository';
import { InvoicesDocumentTypeRepository } from 'src/invoices/repositories/InvoicesDocumentType.repository';
import { InvoicesStatusRepository } from 'src/invoices/repositories/InvoicesStatus.repository';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { TaxesFilterDTO } from './dtos/taxes-filter.dto';
import { TaxesView } from './entities/taxes-view.entity';
import { TaxesRepository } from './repositories/taxes.repository';
import { format } from 'date-fns';
import { Purchase } from '../purchases/entities/Purchase.entity';
import { PurchaseRepository } from 'src/purchases/repositories/Purchase.repository';
import { plainToClass } from 'class-transformer';
import { RInvoice, RPurchase } from './dtos/taxes-response.dto';
import { Branch } from '../companies/entities/Branch.entity';
import { PurchasesDocumentTypeRepository } from '../purchases/repositories/PurchaseDocumentType.repository';
import { PurchasesStatusRepository } from '../purchases/repositories/PurchaseStatus.repository';
import { PurchaseDetailRepository } from '../purchases/repositories/PurchaseDetail.repository';
import { TaxesHeaderDTO } from './dtos/validate/taxes-header.vdto';
import { numeroALetras } from '../_tools';
import { TaxesHeaderCreateDTO } from './dtos/validate/taxes-header-cretae.vdto';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/User.entity';

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

    @InjectRepository(PurchasesDocumentTypeRepository)
    private purchasesDocumentTypeRepository: PurchasesDocumentTypeRepository,

    @InjectRepository(PurchasesStatusRepository)
    private purchasesStatusRepository: PurchasesStatusRepository,

    @InjectRepository(PurchaseDetailRepository)
    private purchaseDetailRepository: PurchaseDetailRepository,

    private authService: AuthService,
  ) {}

  async createRegister(
    data: Partial<TaxesHeaderCreateDTO>,
    company: Company,
    branch: Branch,
    user: User,
  ): Promise<ResponseMinimalDTO> {
    let invoice: Invoices | Purchase;

    switch (data.registerType) {
      case 'invoices':
        if (await this.authService.hasModules(['cfb8addb-541b-482f-8fa1-dfe5db03fdf4'], user, branch, company)) {
          throw new ForbiddenException('Debes crear las ventas desde el modulo de ventas.');
        }
        const customer = await this.customerRepository.getCustomer(data.entity as string, company, 'cliente');
        const documentType = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes([
          data.documentType as number,
        ]);
        const invoiceStatus = await this.invoiceStatusRepository.getInvoicesStatus(5);
        const newData = {
          authorization: data.authorization,
          sequence: data.sequence,
          customer: data.entity,
          inoviceDate: data.date,
          sum: data.sum,
          iva: data.iva,
          subtotal: data.subtotal,
          ivaRetenido: data.ivaRetenido,
          ventaTotal: data.total,
        };
        invoice = await this.invoiceRepository.createInvoice(
          company,
          branch,
          newData,
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
        if (await this.authService.hasModules(['cf5e4b29-f09c-438a-8d82-2ef482a9a461'], user, branch, company)) {
          throw new ForbiddenException('Debes crear las compras desde el modulo de compras.');
        }
        const provider = await this.customerRepository.getCustomer(data.entity as string, company, 'proveedor');
        const purchaseDocumentType = await this.purchasesDocumentTypeRepository.getPurchaseDocumentTypes([
          data.documentType as number,
        ]);
        const purchasesStatus = await this.purchasesStatusRepository.getPurchsesStatus(5);
        const newDatas = {
          authorization: data.authorization,
          sequence: data.sequence,
          provider: data.entity,
          purchaseDate: data.date,
          sum: data.sum,
          iva: data.iva,
          subtotal: data.subtotal,
          compraTotal: data.total,
          fovial: data.fovial,
          contrans: data.contrans,
        };
        invoice = await this.purchaseRepository.createPurchase(
          newDatas,
          provider,
          provider.customerBranches.find((b) => b.default),
          company,
          purchaseDocumentType.data[0],
          branch,
          purchasesStatus,
          '53a36e54-bab2-4824-9e43-b40efab8bab9',
        );
        const purchaseDetails = {
          quantity: 1,
          unitPrice: data.subtotal,
          chargeDescription: 'Detalle generado automaticamente en modulo de IVA',
          incTax: true,
          ventaPrice: data.subtotal,
          purchase: invoice,
        };
        await this.purchaseDetailRepository.createPurchaseDetail([purchaseDetails]);
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
        registerType: r.type,
        iva: r.iva,
        origin: r.origin,
        sequence: r.sequence,
        sum: r.sum,
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
    ResponseSingleDTO<Partial<{ registerType: string } & Invoices> | Partial<{ registerType: string } & Purchase>>
  > {
    let data;

    const register = await this.taxesRepository.getRegister(company, id);

    switch (register.type) {
      case 'invoices':
        data = await this.invoiceRepository.getInvoice(company, id);

        data = {
          id: data.id,
          registerType: 'invoices',
          documentType: data.documentType,
          authorization: data.authorization,
          sequence: data.sequence,
          date: data.invoiceDate,
          entity: { id: data.customer.id, name: data.customer.name, shortName: data.customer.shortName },
          subtotal: data.subtotal,
          iva: data.iva,
          total: data.ventaTotal,
          origin: data.origin,
          sum: data.sum,
        };

        return new ResponseSingleDTO(plainToClass(RInvoice, data));
      case 'purchases':
        data = await this.purchaseRepository.getPurchase(company, id);

        data = {
          id: data.id,
          registerType: 'purchases',
          documentType: data.documentType,
          authorization: data.authorization,
          sequence: data.sequence,
          date: data.purchaseDate,
          entity: { id: data.provider.id, name: data.provider.name, shortName: data.provider.shortName },
          subtotal: data.subtotal,
          iva: data.iva,
          total: data.compraTotal,
          origin: data.origin,
          sum: data.sum,
          fovial: data.fovial,
          contrans: data.contrans,
        };

        return new ResponseSingleDTO(plainToClass(RPurchase, data));
    }
  }

  async updateRegister(id: string, company: Company, data: Partial<TaxesHeaderDTO>): Promise<ResponseMinimalDTO> {
    const register = await this.taxesRepository.getRegister(company, id);
    if (register.origin != '53a36e54-bab2-4824-9e43-b40efab8bab9') {
      throw new BadRequestException('No puedes editar este registro ya que fue generado desde otro modulo.');
    }
    let updated;
    switch (register.type) {
      case 'invoices':
        await this.customerRepository.getCustomer(data.entity as string, company, 'cliente');
        const invoiceToUpdate = {
          authorization: data.authorization,
          sequence: data.sequence,
          customer: data.entity,
          invoiceDate: data.date,
          sum: data.sum,
          iva: data.iva,
          subtotal: data.subtotal,
          ivaRetenido: data.ivaRetenido,
          ventaTotal: data.total,
          ventaTotalText: numeroALetras(data.total),
        };
        const invoice = await this.invoiceRepository.getInvoice(company, id);
        await this.invoiceDetailRepository.deleteInvoiceDetail([invoice.invoiceDetails[0].id]);
        updated = await this.invoiceRepository.updateInvoice([id], invoiceToUpdate);

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
        delete data.ivaRetenido;
        await this.customerRepository.getCustomer(data.entity as string, company, 'proveedor');
        const purchaseToUpdate = {
          authorization: data.authorization,
          sequence: data.sequence,
          provider: data.entity,
          purchaseDate: data.date,
          sum: data.sum,
          iva: data.iva,
          subtotal: data.subtotal,
          compraTotal: data.total,
          fovial: data.fovial,
          contrans: data.contrans,
        };
        const purchase = await this.purchaseRepository.getPurchase(company, id);
        updated = await this.purchaseRepository.updatePurchase(id, company, purchaseToUpdate);

        const purchaseDetails = {
          quantity: 1,
          unitPrice: data.subtotal,
          chargeDescription: 'Detalle generado automaticamente en modulo de IVA',
          incTax: true,
          ventaPrice: data.subtotal,
          purchase: purchase,
        };
        await this.purchaseDetailRepository.createPurchaseDetail([purchaseDetails]);
        break;
    }
    if (updated.affected == 0) {
      throw new BadRequestException('No se ha podido actulizar el registro de IVA seleccionado.');
    }
    return {
      message: 'Se ha actulizado el registro de IVA correctamente.',
    };
  }

  async deleteRegister(id: string, company: Company): Promise<ResponseMinimalDTO> {
    const register = await this.taxesRepository.getRegister(company, id);
    if (register.origin != '53a36e54-bab2-4824-9e43-b40efab8bab9') {
      throw new BadRequestException('No puedes eliminar este registro ya que fue generado desde otro modulo.');
    }
    switch (register.type) {
      case 'invoices':
        const invoice = await this.invoiceRepository.getInvoice(company, register.id);
        await this.invoiceDetailRepository.deleteInvoiceDetail(invoice.invoiceDetails.map((d) => d.id));
        await this.invoiceRepository.deleteInvoice(company, id, invoice);
        break;

      case 'purchases':
        const purchase = await this.purchaseRepository.getPurchase(company, register.id);
        await this.purchaseDetailRepository.deletePurchaseDetail(purchase.purchaseDetails.map((d) => d.id));
        await this.purchaseRepository.deletePurchase(id);
        break;
    }

    return {
      message: 'Se ha eliminado el registro correctamente.',
    };
  }
}
