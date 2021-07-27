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
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/User.entity';
import { GetAuthData } from '../auth/get-auth-data.decorator';
import { Branch } from '../companies/entities/Branch.entity';
import { Company } from '../companies/entities/Company.entity';
import { Invoices } from '../invoices/entities/Invoices.entity';
import { Purchase } from '../purchases/entities/Purchase.entity';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { TaxesFilterDTO } from './dtos/taxes-filter.dto';
import { TaxesHeaderCreateDTO } from './dtos/validate/taxes-header-cretae.vdto';
import { TaxesHeaderDTO } from './dtos/validate/taxes-header.vdto';
import { TaxesService } from './taxes.service';

@Controller('taxes')
@UseGuards(AuthGuard())
export class TaxesController {
  constructor(private taxes: TaxesService, private authService: AuthService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createRegister(
    @Body() data: TaxesHeaderCreateDTO,
    @GetAuthData('company') company: Company,
    @GetAuthData('branch') branch: Branch,
    @GetAuthData('user') user: User,
  ): Promise<ResponseMinimalDTO> {
    return this.taxes.createRegister(data, company, branch, user);
  }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoicesTaxes(
    @Query() filter: TaxesFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Partial<Invoices>, number, number, number>> {
    const { data, count, page, limit } = await this.taxes.getRegisters(company, filter);
    return new ResponseListDTO(plainToClass(Invoices, data), count, page, limit);
  }

  @Get('/:id')
  async getRegister(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Partial<Invoices> | Partial<Purchase>>> {
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

  @Delete('/:id')
  async deleteRegister(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return await this.taxes.deleteRegister(id, company);
  }
}
