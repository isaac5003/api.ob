import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { User } from 'src/auth/entities/User.entity';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { EchargesFilterDTO } from './dtos/echages-filter.dto';
import { EchargesActiveDTO } from './dtos/validate/echarge-active.vdto';
import { EchargesHeaderDTO } from './dtos/validate/echarges-header.vdto';
import { EchargesService } from './echarges.service';
import { Echarges } from './entities/echarges.entity';

@Controller('echarges')
@UseGuards(AuthGuard())
export class EchargesController {
  constructor(private echargesService: EchargesService) {}
  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomers(
    @Query() filter: EchargesFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Echarges, number, number, number>> {
    const { data, count } = await this.echargesService.getEcharges(company, filter);
    return new ResponseListDTO(plainToClass(Echarges, data), count, filter.page, filter.limit);
  }

  @Get('/:id')
  async getEcharge(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Echarges>> {
    return await this.echargesService.getEcharge(company, id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createEcharges(
    @Body() data: EchargesHeaderDTO,
    @GetAuthData('company') company: Company,
    @GetAuthData('user') user: User,
  ): Promise<ResponseMinimalDTO> {
    return await this.echargesService.createRegister(data, company, user);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateEcharge(
    @Param('id') id: string,
    @Body() data: EchargesHeaderDTO,
    @GetAuthData('company') company: Company,
    @GetAuthData('user') user: User,
  ): Promise<ResponseMinimalDTO> {
    return await this.echargesService.updateEcharge(id, data, company, user);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateEchargeStatus(
    @Param('id') id: string,
    @Body() data: EchargesActiveDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.echargesService.changeActive(id, company, data);
  }
}
