import { Controller, Get, Param, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseListDTO, ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';
import { InvoicesStatusService } from '../services/invoices.status.service';

@Controller('/status')
@UseGuards(AuthGuard())
export class InvoicesStatusController {
  constructor(private invoiceStatus: InvoicesStatusService) {}

  @Get('/')
  async getInvoicesStatus(): Promise<ResponseListDTO<InvoicesStatus, number, number, number>> {
    const { data, count } = await this.invoiceStatus.getInvoicesStatuses();
    return new ResponseListDTO(plainToClass(InvoicesStatus, data), count);
  }

  @Put('/void/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async voidInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoiceStatus.updateInvoicesStatus(company, id, 'void');
  }

  @Put('/printed/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async printedInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoiceStatus.updateInvoicesStatus(company, id, 'printed');
  }

  @Put('/paid/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async paidInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoiceStatus.updateInvoicesStatus(company, id, 'paid');
  }

  @Put('/reverse/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async reverseInvoice(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.invoiceStatus.updateInvoicesStatus(company, id, 'reverse');
  }
}
