import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
import { InvoiceDataDTO } from './dtos/invoice-data.dto';
import { Branch } from 'src/companies/entities/Branch.entity';
import { InvoiceReserveDataDTO } from './dtos/invoice-reserve-data.dto';

@Controller('invoices')
@UseGuards(AuthGuard())
export class InvoicesController {
  constructor(private invoice: InvoicesService) {}

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
    @Body() data: InvoiceDataDTO,
    @GetAuthData('company') company: Company,
    @GetAuthData('branch') branch: Branch,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createInvoice(company, branch, data);
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
}
