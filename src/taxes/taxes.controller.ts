import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { Purchase } from 'src/purchases/entities/Purchase.entity';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { TaxesFilterDTO } from './dtos/taxes-filter.dto';
import { TaxesHeaderCreateDTO } from './dtos/validate/taxes-header-cretae.vdto';
import { TaxesHeaderDTO } from './dtos/validate/taxes-header.vdto';
import { TaxesService } from './taxes.service';

@Controller('taxes')
@UseGuards(AuthGuard())
export class TaxesController {
  constructor(private taxes: TaxesService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRegister(
    @Body() data: TaxesHeaderCreateDTO,
    @GetAuthData('company') company: Company,
    @GetAuthData('branch') branch: Branch,
  ): Promise<ResponseMinimalDTO> {
    return this.taxes.createRegister(data, company, branch);
  }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesTaxes(
    @Query() filter: TaxesFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Partial<Invoice>, number, number, number>> {
    const { data, count, page, limit } = await this.taxes.getRegisters(company, filter);
    return new ResponseListDTO(plainToClass(Invoice, data), count, page, limit);
  }

  @Get('/:id')
  async getRegister(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Partial<Invoice> | Partial<Purchase>>> {
    return await this.taxes.getRegister(id, company);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateRegister(
    @Param('id') id: string,
    @Body() data: TaxesHeaderDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.taxes.updateRegister(id, company, data);
  }
}
