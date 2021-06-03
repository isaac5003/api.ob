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
import { InvoicesService } from './invoices.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthData } from '../auth/get-auth-data.decorator';
import { Company } from '../companies/entities/Company.entity';
import { ReportsDTO, ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { InvoicesDocumentType } from './entities/InvoicesDocumentType.entity';
import { InvoicesStatus } from './entities/InvoicesStatus.entity';
import { InvoicesZone } from './entities/InvoicesZone.entity';
import { FilterDTO } from '../_dtos/filter.dto';
import { InvoiceZonesDataDTO } from './dtos/zones/invoice-data.dto';
import { InvoicesPaymentsCondition } from './entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from './entities/InvoicesSeller.entity';
import { InvoicesDocument } from './entities/InvoicesDocument.entity';
import { InvoiceDocumentDataDTO } from './dtos/documents/invoice-document-data.dto';
import { InvoiceDocumentUpdateDTO } from './dtos/documents/invoice-document-update.dto';
import { InvoiceDocumentLayoutDTO } from './dtos/documents/invoice-document-layout.dto';
import { ReportFilterDTO } from './dtos/invoice-report-filter.dto';
import { Invoice } from './entities/Invoice.entity';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { InvoiceHeaderCreateDTO } from './dtos/invoice-header-create.dto';
import { InvoiceDetailDTO } from './dtos/invoice-details.dto';
import { Branch } from '../companies/entities/Branch.entity';
import { InvoiceReserveDataDTO } from './dtos/invoice-reserve-data.dto';
import { InvoiceUpdateHeaderDTO } from './dtos/invoice-header-update.dto';
import { ActiveValidateDTO } from './dtos/invoice-active.dto';
import { InvoicePaymentConditionDataDTO } from './dtos/payment-condition/invoice-data.dto';
import { InvoiceSellerDataDTO } from './dtos/sellers/invoice-data.dto';
import { DocumentFilterDTO } from './dtos/documents/invoice-documnet-filter.dto';

@Controller('invoices')
@UseGuards(AuthGuard())
export class InvoicesController {
  constructor(private invoice: InvoicesService) {}

  @Get('/document-types')
  async getInvoicesDocumentType(): Promise<ResponseListDTO<InvoicesDocumentType, number>> {
    return this.invoice.getInvoicesDocumentTypes();
  }

  @Get('/status')
  async getInvoicesStatus(): Promise<ResponseListDTO<InvoicesStatus, number>> {
    return this.invoice.getInvoicesStatuses();
  }

  @Put('/status/void/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async voidInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoicesStatus(company, id, 'void');
  }

  @Put('/status/printed/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async printedInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoicesStatus(company, id, 'printed');
  }

  @Put('/status/paid/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async paidInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoicesStatus(company, id, 'paid');
  }

  @Put('/status/reverse/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async reverseInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoice.updateInvoicesStatus(company, id, 'reverse');
  }

  @Get('/zones')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesZones(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesZone, number>> {
    return this.invoice.getInvoicesZones(company, filter);
  }

  @Post('/zones')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicesZone(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceZonesDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createInvoicesZone(company, data);
  }

  @Put('/zones/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: InvoiceZonesDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicesZone(id, company, data);
  }

  @Put('/zones/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZoneStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicesZone(id, company, data);
  }

  @Delete('/zones/:id')
  async deleteInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.deleteInvoicesZone(company, id);
  }

  @Get('/payment-condition')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesPaymentConditions(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesPaymentsCondition, number>> {
    return this.invoice.getInvoicesPaymentConditions(company, filter);
  }

  @Post('/payment-condition')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Body() data: InvoicePaymentConditionDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createInvoicesPaymentCondition(company, data);
  }

  @Put('/payment-condition/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: InvoicePaymentConditionDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicesPaymentCondition(id, company, data);
  }

  @Put('/payment-condition/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicePaymentConditionStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicesPaymentCondition(id, company, data);
  }

  @Delete('/payment-condition/:id')
  async deleteInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.deleteInvoicesPaymentCondition(company, id);
  }

  @Get('/sellers')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesSellers(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesSeller, number>> {
    return this.invoice.getInvoicesSellers(company, filter);
  }

  @Post('/sellers')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicesSeller(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceSellerDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createInvoicesSeller(company, data);
  }

  @Put('/sellers/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicesSeller(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceSellerDataDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicesSeller(id, company, data);
  }

  @Put('/sellers/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSellerStatus(
    @GetAuthData('company') company: Company,
    @Body() data: ActiveValidateDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoicesSeller(id, company, data);
  }

  @Delete('/sellers/:id')
  async deleteInvoicesSeller(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.deleteInvoicesSeller(company, id);
  }

  @Get('/documents')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoiceDocuments(
    @GetAuthData('company') company: Company,
    @Query() filter: DocumentFilterDTO,
  ): Promise<ResponseListDTO<InvoicesDocument, number>> {
    return await this.invoice.getDocuments(company, filter);
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
    @Body('documents') data: InvoiceDocumentUpdateDTO[],
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createUpdateDocument(company, data, 'update');
  }

  @Get('/documents/:id/layout')
  async getDocumentLayout(
    @GetAuthData('company') company: Company,
    @Param('id') id: number,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    return await this.invoice.getDocumentLayout(company, id);
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

  @Put('/documents/documentlayout/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUpdateLayout(
    @Param('id') id: string,
    @Body() data: InvoiceDocumentLayoutDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createUpdateDocumentLayout(company, parseInt(id), data);
  }

  @Get('/report/general')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReport(@Query() filter: ReportFilterDTO, @GetAuthData('company') company: Company): Promise<ReportsDTO> {
    return await this.invoice.generateReport(company, filter);
  }

  @Get('/report/invoice-list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReportInvoiceList(
    @Query() filter: ReportFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ReportsDTO> {
    return await this.invoice.generateReportInvoiceList(company, filter);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoices(
    @Query() filter: InvoiceFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Partial<Invoice>, number>> {
    return this.invoice.getInvoices(company, filter);
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

  @Delete('/:id')
  async deleteInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoice.deleteInvoice(company, id);
  }
}
