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
import { InvoicePaymentConditionDataDTO } from '../dtos/payment-condition/invoice-data.dto';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';
import { InvoicesPaymentsConditionService } from '../services/invoices.paymentsCondition.service';

@Controller('/payment-condition')
@UseGuards(AuthGuard())
export class InvoicesPaymentsConditionController {
  constructor(private invoicePaymentCondition: InvoicesPaymentsConditionService) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesPaymentConditions(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesPaymentsCondition, number, number, number>> {
    const { data, count } = await this.invoicePaymentCondition.getInvoicesPaymentConditions(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesPaymentsCondition, data), count, filter.page, filter.limit);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Body() data: InvoicePaymentConditionDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicePaymentCondition.createInvoicesPaymentCondition(company, data);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: InvoicePaymentConditionDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicePaymentCondition.updateInvoicesPaymentCondition(id, company, data);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoicePaymentConditionStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicePaymentCondition.updateInvoicesPaymentCondition(id, company, data);
  }

  @Delete('/:id')
  async deleteInvoicePaymentCondition(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoicePaymentCondition.deleteInvoicesPaymentCondition(company, id);
  }
}
