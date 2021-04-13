import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Invoice } from './entities/Invoice.entity';
import { InvoicesService } from './invoices.service';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import {
  ResponseListDTO,
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { Branch } from 'src/companies/entities/Branch.entity';
import { InvoiceReserveDataDTO } from './dtos/invoice-reserve-data.dto';
import { InvoiceHeaderCreateDTO } from './dtos/invoice-header-create.dto';
import { InvoiceDetailDTO } from './dtos/invoice-details.dto';
import { InvoiceUpdateHeaderDTO } from './dtos/invoice-header-update.dto';
import { InvoicesDocumentType } from './entities/InvoicesDocumentType.entity';
import { InvoicesStatus } from './entities/InvoicesStatus.entity';
import { InvoicesZone } from './entities/InvoicesZone.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { InvoiceAuxiliarDataDTO } from './dtos/invoice-auxiliar-data.dto';
import { InvoicesPaymentsCondition } from './entities/InvoicesPaymentsCondition.entity';
import { InvoicesSellerRepository } from './repositories/InvoicesSeller.repository';
import { InvoicesSeller } from './entities/InvoicesSeller.entity';
import { PaymentConditionCreateDTO } from './dtos/invoice-paymentcondition-data.dto';
import { InvoiceSellerDataDTO } from './dtos/invoice-seller-data.dto';
import { InvoiceAuxiliarUpdateDTO } from './dtos/invoice-auxiliar-update.dto';
import { InvoiceDocumentFilterDTO } from './dtos/invoice-document-filter.dto';
import { InvoicesDocument } from './entities/InvoicesDocument.entity';
import { InvoiceDocumentDataDTO } from './dtos/invoice-document-data.dto';
import { DocumentUpdateDTO } from './dtos/invoice-document-update.dto';
import { DocumentLayoutDTO } from './dtos/invoice-documentLayout.dto';
import { ActiveValidateDTO } from './dtos/invoice-active-auxiliar.dto';
import { ReportFilterDTO } from './dtos/invoice-report-filter.dto';

@Controller('invoices')
@UseGuards(AuthGuard())
export class InvoicesController {
  constructor(private invoice: InvoicesService) {}

  @Get('/document-types')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesDocumentType(): Promise<
    ResponseListDTO<InvoicesDocumentType>
  > {
    const invoices = await this.invoice.getInvoiceDocumentsType();
    return new ResponseListDTO(plainToClass(InvoicesDocumentType, invoices));
  }

  @Get('/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesStatus(): Promise<ResponseListDTO<InvoicesStatus>> {
    const invoices = await this.invoice.getInvoiceStatuses();
    return new ResponseListDTO(plainToClass(InvoicesStatus, invoices));
  }

  @Get('/zones')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesZones(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesZone>> {
    const invoicesZones = await this.invoice.getInvoiceZones(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesZone, invoicesZones));
  }

  @Post('/zones')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoiceZone(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceAuxiliarDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createInvoiceZone(company, data);
  }

  @Put('/zones/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: InvoiceAuxiliarUpdateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoiceZone(id, company, data);
  }

  @Put('/zones/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZoneStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoiceZone(id, company, data);
  }

  @Delete('/zones/:id')
  async deleteInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.deleteInvoiceZone(company, id);
  }

  @Get('/payment-condition')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesPaymentConditions(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesPaymentsCondition>> {
    const invoicesPaymentCondition = await this.invoice.getInvoicePaymentConditions(
      company,
      filter,
    );
    return new ResponseListDTO(
      plainToClass(InvoicesPaymentsCondition, invoicesPaymentCondition),
    );
  }

  @Post('/payment-condition')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Body() data: PaymentConditionCreateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createInvoicePaymentCondition(company, data);
  }

  @Put('/payment-condition/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: PaymentConditionCreateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicePaymentCondition(id, company, data);
  }

  @Put('/payment-condition/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicePaymentConditionStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicePaymentCondition(id, company, data);
  }

  @Delete('/payment-condition/:id')
  async deleteInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.deleteInvoicePaymentCondition(company, id);
  }

  @Get('/sellers')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSellers(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesSeller>> {
    const sellers = await this.invoice.getSellers(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesSeller, sellers));
  }

  @Post('/sellers')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSeller(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceSellerDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createSeller(company, data);
  }

  @Put('/sellers/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSeller(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceAuxiliarUpdateDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateSeller(id, company, data, 'seller');
  }

  @Put('/sellers/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSellerStatus(
    @GetAuthData('company') company: Company,
    @Body() data: ActiveValidateDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateSeller(id, company, data, 'status');
  }

  @Delete('/sellers/:id')
  async deleteInvoiceSeller(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.deleteSeller(company, id);
  }

  @Get('/documents')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoiceDocuments(
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<InvoicesDocument>> {
    return await this.invoice.getDocuments(company);
  }

  @Get('/documents/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoiceDocument(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    return await this.invoice.getDocument(company, id);
  }

  @Post('/documents')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createDocument(
    @Body('documents') data: InvoiceDocumentDataDTO[],
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createUpdateDocument(company, data, 'create');
  }

  @Put('/documents')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceDocument(
    @GetAuthData('company') company: Company,
    @Body('documents') data: DocumentUpdateDTO[],
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createUpdateDocument(company, data, 'update');
  }

  @Put('/documents/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceDocumentStatus(
    @GetAuthData('company') company: Company,
    @Body() data: ActiveValidateDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateDocumentStatus(id, company, data);
  }

  @Get('/documents/:id/layout')
  async getDocumentLayout(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    return await this.invoice.getDocumentLayout(company, id);
  }

  @Put('/documents/documentlayout/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUpdateLayout(
    @Param('id') id: string,
    @Body() data: DocumentLayoutDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createUpdateDocumentLayout(company, parseInt(id), data);
  }

  @Get('/report/general')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReport(
    @Query() filter: ReportFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Invoice>> {
    return await this.invoice.generateReport(company, filter);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoices(
    @Query() filter: InvoiceFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Invoice>> {
    const invoices = await this.invoice.getInvoices(company, filter);
    return new ResponseListDTO(plainToClass(Invoice, invoices));
  }

  @Get('/:id')
  async getInvoice(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Invoice>> {
    return await this.invoice.getInvoice(company, id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoice(
    @Body('header') header: InvoiceHeaderCreateDTO,
    @Body('details') details: InvoiceDetailDTO[],
    @GetAuthData('company') company: Company,
    @GetAuthData('branch') branch: Branch,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createInvoice(company, branch, { header, details });
  }

  @Post('/reserved')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoiceReserve(
    @Body() data: InvoiceReserveDataDTO,
    @GetAuthData('company') company: Company,
    @GetAuthData('branch') branch: Branch,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createInvoiceReserve(company, branch, data);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoice(
    @Param('id') id: string,
    @Body('header') header: InvoiceUpdateHeaderDTO,
    @Body('details') details: InvoiceDetailDTO[],
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoice(company, id, { header, details });
  }

  @Put('/status/void/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async voidInvoice(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoiceStatus(company, id, 'void');
  }

  @Put('/status/printed/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async printedInvoice(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoiceStatus(company, id, 'printed');
  }

  @Put('/status/paid/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async paidInvoice(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoiceStatus(company, id, 'paid');
  }

  @Put('/status/reverse/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async reverseInvoice(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoiceStatus(company, id, 'reverse');
  }

  @Delete('/:id')
  async deleteInvoice(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.deleteInvoice(company, id);
  }
}
