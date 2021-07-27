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
import { InvoicesService } from '../services/invoices.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthData } from '../../auth/get-auth-data.decorator';
import { Company } from '../../companies/entities/Company.entity';
import { ReportsDTO, ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../../_dtos/responseList.dto';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';
import { ReportFilterDTO } from '../dtos/invoice-report-filter.dto';
import { Invoice } from '../entities/Invoice.entity';
import { InvoiceFilterDTO } from '../dtos/invoice-filter.dto';
import { InvoiceHeaderCreateDTO } from '../dtos/invoice-header-create.dto';
import { InvoiceDetailDTO } from '../dtos/invoice-details.dto';
import { Branch } from '../../companies/entities/Branch.entity';
import { InvoiceReserveDataDTO } from '../dtos/invoice-reserve-data.dto';
import { InvoiceUpdateHeaderDTO } from '../dtos/invoice-header-update.dto';
import { plainToClass } from 'class-transformer';
import { InvoicesEntriesRecurrency } from '../entities/InvoicesEntriesRecurrency.entity';
import { User } from '../../auth/entities/User.entity';

@Controller()
@UseGuards(AuthGuard())
export class InvoicesController {
  constructor(private invoice: InvoicesService) {}

  @Get('/recurrencies')
  async getInvoiceEntriesRecurrencies(): Promise<ResponseListDTO<InvoicesEntriesRecurrency, number, number, number>> {
    const { data, count } = await this.invoice.getInvoicesEntriesRecurrencies();
    return new ResponseListDTO(plainToClass(InvoicesEntriesRecurrency, data), count);
  }

  @Get('/document-types')
  async getInvoicesDocumentType(): Promise<ResponseListDTO<InvoicesDocumentType, number, number, number>> {
    const { data, count } = await this.invoice.getInvoicesDocumentTypes();
    return new ResponseListDTO(plainToClass(InvoicesDocumentType, data), count);
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
  ): Promise<ResponseListDTO<Partial<Invoice>, number, number, number>> {
    const { data, count } = await this.invoice.getInvoices(company, filter);
    return new ResponseListDTO(plainToClass(Invoice, data), count, filter.page, filter.limit);
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
    @GetAuthData('user') user: User,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createInvoice(company, branch, { header, details }, user);
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
