import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { InvoiceFilterDTO } from 'src/invoices/dtos/invoice-filter.dto';
import { ResponseMinimalDTO } from '../_dtos/responseList.dto';
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

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesTaxes(
    @Query() filter: InvoiceFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {}
}
