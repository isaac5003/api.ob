import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  ResponseListDTO,
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './entities/Service.entity';
import { ServicesService } from './services.service';
import { AuthGuard } from '@nestjs/passport';
import { GetCompany } from 'src/auth/get-company.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { serviceDataDTO } from './dtos/service-data.dto';

@Controller('services')
@UseGuards(AuthGuard())
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getServices(
    @Query() filterDto: ServiceFilterDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseListDTO<Service>> {
    const services = await this.servicesService.getServices(company, filterDto);
    return new ResponseListDTO(plainToClass(Service, services));
  }

  @Get('/:id')
  async getService(
    @Param('id') id: string,
    @GetCompany() company: Company,
  ): Promise<ResponseSingleDTO<Service>> {
    const service = await this.servicesService.getService(company, id);
    return new ResponseSingleDTO(plainToClass(Service, service));
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createService(
    @Body() createDTO: serviceDataDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.servicesService.createService(company, createDTO);
  }

  @Delete('/:id')
  async deleteService(
    @Param('id') id: string,
    @GetCompany() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.servicesService.deleteService(company, id);
  }
}
