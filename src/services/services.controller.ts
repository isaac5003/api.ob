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
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { serviceDataDTO } from './dtos/service-data.dto';
import { serviceStatusDTO } from './dtos/service-status.dto';
import { ServiceIntegrationDTO } from './dtos/service-integration.dto';

@Controller('services')
@UseGuards(AuthGuard())
export class ServicesController {
  constructor(private service: ServicesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getServices(
    @Query() filter: ServiceFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Service>> {
    const services = await this.service.getServices(company, filter);
    return new ResponseListDTO(plainToClass(Service, services));
  }

  @Get('/:id')
  async getService(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Service>> {
    const service = await this.service.getService(company, id);
    return new ResponseSingleDTO(plainToClass(Service, service));
  }

  @Get('/:id/integrations')
  async getServiceIntegrations(
    @Param('id') id: string,
    @GetAuthData() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.getServiceIntegrations(company, id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createService(
    @Body() data: serviceDataDTO,
    @GetAuthData() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.createService(company, data);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateService(
    @Param('id') id: string,
    @GetAuthData() company: Company,
    @Body() data: serviceDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateService(company, id, data);
  }

  @Put('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateServiceIntegrations(
    @Param('id') id: string,
    @GetAuthData() company: Company,
    @Body() data: ServiceIntegrationDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateService(company, id, data);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateServiceStatus(
    @Param('id') id: string,
    @GetAuthData() company: Company,
    @Body() data: serviceStatusDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateService(company, id, data);
  }

  @Delete('/:id')
  async deleteService(
    @Param('id') id: string,
    @GetAuthData() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.deleteService(company, id);
  }
}
