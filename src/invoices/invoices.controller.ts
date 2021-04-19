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
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseListDTO, ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { InvoicesDocumentType } from './entities/InvoicesDocumentType.entity';
import { InvoicesStatus } from './entities/InvoicesStatus.entity';
import { InvoicesZone } from './entities/InvoicesZone.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { InvoiceZonesDataDTO } from './dtos/zones/invoice-data.dto';
import { ActiveValidateDTO } from './dtos/invoice-active-auxiliar.dto';
import { InvoicesPaymentsCondition } from './entities/InvoicesPaymentsCondition.entity';
import { InvoicePaymentConditionDataDTO } from './dtos/payment-condition/invoice-data.dto';

@Controller('invoices')
@UseGuards(AuthGuard())
export class InvoicesController {
  constructor(private invoice: InvoicesService) {}

  @Get('/document-types')
  async getInvoicesDocumentType(): Promise<ResponseListDTO<InvoicesDocumentType>> {
    const invoices = await this.invoice.getInvoicesDocumentTypes();
    return new ResponseListDTO(plainToClass(InvoicesDocumentType, invoices));
  }

  @Get('/status')
  async getInvoicesStatus(): Promise<ResponseListDTO<InvoicesStatus>> {
    const invoices = await this.invoice.getInvoicesStatuses();
    return new ResponseListDTO(plainToClass(InvoicesStatus, invoices));
  }

  @Get('/zones')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesZones(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesZone>> {
    const invoicesZones = await this.invoice.getInvoicesZones(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesZone, invoicesZones));
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
  ): Promise<ResponseListDTO<InvoicesPaymentsCondition>> {
    const invoicesPaymentCondition = await this.invoice.getInvoicesPaymentConditions(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesPaymentsCondition, invoicesPaymentCondition));
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

  // @Get('/sellers')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getSellers(
  //   @GetAuthData('company') company: Company,
  //   @Query() filter: FilterDTO,
  // ): Promise<ResponseListDTO<InvoicesSeller>> {
  //   const sellers = await this.invoice.getSellers(company, filter);
  //   return new ResponseListDTO(plainToClass(InvoicesSeller, sellers));
  // }

  // @Post('/sellers')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async createSeller(
  //   @GetAuthData('company') company: Company,
  //   @Body() data: InvoiceSellerDataDTO,
  // ): Promise<ResponseMinimalDTO> {
  //   return await this.invoice.createSeller(company, data);
  // }

  // @Put('/sellers/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateSeller(
  //   @GetAuthData('company') company: Company,
  //   @Body() data: InvoiceAuxiliarUpdateDTO,
  //   @Param('id') id: string,
  // ): Promise<ResponseMinimalDTO> {
  //   return await this.invoice.updateSeller(id, company, data, 'seller');
  // }

  // @Put('/sellers/status/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateSellerStatus(
  //   @GetAuthData('company') company: Company,
  //   @Body() data: ActiveValidateDTO,
  //   @Param('id') id: string,
  // ): Promise<ResponseMinimalDTO> {
  //   return await this.invoice.updateSeller(id, company, data, 'status');
  // }

  // @Delete('/sellers/:id')
  // async deleteInvoiceSeller(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.deleteSeller(company, id);
  // }

  // @Get('/documents')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getInvoiceDocuments(
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseListDTO<InvoicesDocument>> {
  //   return await this.invoice.getDocuments(company);
  // }

  // @Get('/documents/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getInvoiceDocument(
  //   @GetAuthData('company') company: Company,
  //   @Param('id') id: string,
  // ): Promise<ResponseSingleDTO<InvoicesDocument>> {
  //   return await this.invoice.getDocument(company, id);
  // }

  // @Post('/documents')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async createDocument(
  //   @Body('documents') data: InvoiceDocumentDataDTO[],
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return await this.invoice.createUpdateDocument(company, data, 'create');
  // }

  // @Put('/documents')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateInvoiceDocument(
  //   @GetAuthData('company') company: Company,
  //   @Body('documents') data: DocumentUpdateDTO[],
  // ): Promise<ResponseMinimalDTO> {
  //   return await this.invoice.createUpdateDocument(company, data, 'update');
  // }

  // @Put('/documents/status/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateInvoiceDocumentStatus(
  //   @GetAuthData('company') company: Company,
  //   @Body() data: ActiveValidateDTO,
  //   @Param('id') id: string,
  // ): Promise<ResponseMinimalDTO> {
  //   return await this.invoice.updateDocumentStatus(id, company, data);
  // }

  // @Get('/documents/:id/layout')
  // async getDocumentLayout(
  //   @GetAuthData('company') company: Company,
  //   @Param('id') id: string,
  // ): Promise<ResponseSingleDTO<InvoicesDocument>> {
  //   return await this.invoice.getDocumentLayout(company, id);
  // }

  // @Put('/documents/documentlayout/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async createUpdateLayout(
  //   @Param('id') id: string,
  //   @Body() data: DocumentLayoutDTO,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.createUpdateDocumentLayout(company, parseInt(id), data);
  // }

  // @Get('/report/general')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getReport(
  //   @Query() filter: ReportFilterDTO,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseListDTO<Invoice>> {
  //   return await this.invoice.generateReport(company, filter);
  // }

  // @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getInvoices(
  //   @Query() filter: InvoiceFilterDTO,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseListDTO<Invoice>> {
  //   return await this.invoice.getInvoices(company, filter);
  // }

  // @Get('/:id')
  // async getInvoice(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseSingleDTO<Invoice>> {
  //   return await this.invoice.getInvoice(company, id);
  // }

  // @Post('/')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async createInvoice(
  //   @Body('header') header: InvoiceHeaderCreateDTO,
  //   @Body('details') details: InvoiceDetailDTO[],
  //   @GetAuthData('company') company: Company,
  //   @GetAuthData('branch') branch: Branch,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.createInvoice(company, branch, { header, details });
  // }

  // @Post('/reserved')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async createInvoiceReserve(
  //   @Body() data: InvoiceReserveDataDTO,
  //   @GetAuthData('company') company: Company,
  //   @GetAuthData('branch') branch: Branch,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.createInvoiceReserve(company, branch, data);
  // }

  // @Put('/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async updateInvoice(
  //   @Param('id') id: string,
  //   @Body('header') header: InvoiceUpdateHeaderDTO,
  //   @Body('details') details: InvoiceDetailDTO[],
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.updateInvoice(company, id, { header, details });
  // }

  // @Put('/status/void/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async voidInvoice(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.updateInvoiceStatus(company, id, 'void');
  // }

  // @Put('/status/printed/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async printedInvoice(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.updateInvoiceStatus(company, id, 'printed');
  // }

  // @Put('/status/paid/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async paidInvoice(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.updateInvoiceStatus(company, id, 'paid');
  // }

  // @Put('/status/reverse/:id')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async reverseInvoice(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.updateInvoiceStatus(company, id, 'reverse');
  // }

  // @Delete('/:id')
  // async deleteInvoice(
  //   @Param('id') id: string,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseMinimalDTO> {
  //   return this.invoice.deleteInvoice(company, id);
  // }
}
