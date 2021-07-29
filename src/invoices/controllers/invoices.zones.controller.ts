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
import { InvoiceZonesDataDTO } from '../dtos/zones/invoice-data.dto';
import { InvoicesZones } from '../entities/invoices.zones.entity';
import { InvoicesZonesService } from '../services/invoices.zones.service';

@Controller('/zones')
@UseGuards(AuthGuard())
export class InvoicesZonesController {
  constructor(private invoiceZone: InvoicesZonesService) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesZones(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<InvoicesZones, number, number, number>> {
    const { data, count } = await this.invoiceZone.getInvoicesZones(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesZones, data), count, filter.page, filter.limit);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoicesZone(
    @GetAuthData('company') company: Company,
    @Body() data: InvoiceZonesDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceZone.createInvoicesZone(company, data);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: InvoiceZonesDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceZone.updateInvoicesZone(id, company, data);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceZoneStatus(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
    @Body() data: ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceZone.updateInvoicesZone(id, company, data);
  }

  @Delete('/:id')
  async deleteInvoiceZone(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceZone.deleteInvoicesZone(company, id);
  }
}
