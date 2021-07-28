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
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseListDTO, ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoiceSellerDataDTO } from '../dtos/sellers/invoice-data.dto';
import { InvoicesSellers } from '../entities/invoices.sellers.entity';
import { InvoicesSellersService } from '../services/invoices.sellers.service';

@Controller('/sellers')
@UseGuards(AuthGuard())
export class InvoicesSellersController {
  constructor(private invoicesSeller: InvoicesSellersService) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesSellers(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesSellers, number, number, number>> {
    const { data, count } = await this.invoicesSeller.getInvoicesSellers(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesSellers, data), count, filter.page, filter.limit);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicesSeller(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceSellerDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicesSeller.createInvoicesSeller(company, data);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicesSeller(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceSellerDataDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicesSeller.updateInvoicesSeller(id, company, data);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSellerStatus(
    @GetAuthData('company') company: Company,
    @Body() data: ActiveValidateDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicesSeller.updateInvoicesSeller(id, company, data);
  }

  @Delete('/:id')
  async deleteInvoicesSeller(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoicesSeller.deleteInvoicesSeller(company, id);
  }
}
