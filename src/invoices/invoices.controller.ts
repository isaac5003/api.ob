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
import { GetCompany } from 'src/auth/get-company.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import {
  ResponseListDTO,
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { InvoiceFilterDTO } from './dtos/invoice-filter.dto';
import { InvoiceDataDTO } from './dtos/invoice-data.dto';

@Controller('invoices')
@UseGuards(AuthGuard())
export class InvoicesController {
  constructor(private invoice: InvoicesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoices(
    @Query() filter: InvoiceFilterDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseListDTO<Invoice>> {
    const invoices = await this.invoice.getInvoices(company, filter);
    return new ResponseListDTO(plainToClass(Invoice, invoices));
  }

  @Get('/:id')
  async getInvoice(
    @Param('id') id: string,
    @GetCompany() company: Company,
  ): Promise<ResponseSingleDTO<Invoice>> {
    return await this.invoice.getInvoice(company, id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createService(
    @Body() data: InvoiceDataDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoice.createInvoice(company, data);
  }
}
