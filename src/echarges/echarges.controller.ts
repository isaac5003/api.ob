import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { EchargesHeaderDTO } from './dtos/validate/echarges-header.vdto';
import { EchargesService } from './echarges.service';
import { Echarges } from './entities/echarges.entity';

@Controller('echarges')
@UseGuards(AuthGuard())
export class EchargesController {
  constructor(private echargesService: EchargesService) {}

  @Get('/:id')
  async getEcharge(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Echarges>> {
    const echarge = await this.echargesService.getEcharge(company, id);
    return new ResponseSingleDTO(plainToClass(Echarges, echarge));
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createEcharges(
    @Body() data: EchargesHeaderDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.echargesService.createRegister(data, company);
  }
}
