import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { InvoiceFilterDTO } from 'src/invoices/dtos/invoice-filter.dto';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { ResponseListDTO, ResponseMinimalDTO } from '../_dtos/responseList.dto';
import { RegisterTaxDTO } from './dtos/taxes-register.dto';
import { TaxesService } from './taxes.service';

@Controller('taxes')
@UseGuards(AuthGuard())
export class TaxesController {
  constructor(private taxes: TaxesService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createService(
    @Body() data: RegisterTaxDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.taxes.createInvoice(data, company);
  }

  // @Get('/')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getInvoicesTaxes(
  //   @Query() filter: InvoiceFilterDTO,
  //   @GetAuthData('company') company: Company,
  // ): Promise<ResponseListDTO<Partial<Invoice>, number, number, number>> {
  //   const { data, count, page, limit } = await this.taxes.getInvoices(company, filter);
  //   return new ResponseListDTO(plainToClass(Invoice, data), count, page, limit);
  // }
}
