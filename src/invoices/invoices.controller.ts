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
    @Body() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesZone>> {
    const invoicesZones = await this.invoice.getInvoiceZones(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesZone, invoicesZones));
  }

  @Post('/zones')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoiceZone(
    @GetAuthData('company') company: Company,
    @Body() data: Partial<InvoiceAuxiliarDataDTO>,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.createInvoiceZone(company, data);
  }

  @Put('/zones/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: Partial<InvoiceAuxiliarDataDTO>,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoice.updateInvoiceZone(id, company, data);
  }

  @Put('/zones/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZoneStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: Partial<InvoiceAuxiliarDataDTO>,
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
