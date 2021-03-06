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
  ServiceReportGeneralDTO,
} from '../_dtos/responseList.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './entities/Service.entity';
import { ServicesService } from './services.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthData } from '../auth/get-auth-data.decorator';
import { Company } from '../companies/entities/Company.entity';
import { serviceDataDTO } from './dtos/service-data.dto';
import { serviceStatusDTO } from './dtos/service-status.dto';
import { ServiceIntegrationDTO } from './dtos/service-integration.dto';
import { ServicesIdsDTO } from './dtos/delete-updateServices/service-deleteupdate.dto';
import { UpdateStatusDTO } from './dtos/delete-updateServices/service-update-status.dto';
import { SellingType } from '../system/entities/SellingType.entity';

@Controller('services')
@UseGuards(AuthGuard())
export class ServicesController {
  constructor(private service: ServicesService) {}
  // FOR SERVICES /
  @Get('/selling-types')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSellingTypes(): Promise<ResponseListDTO<SellingType, number, number, number>> {
    const { data, count } = await this.service.getSellyingTypes();
    return new ResponseListDTO(plainToClass(SellingType, data), count);
  }

  // FOR SETTINGS
  @Get('/setting/integrations/:shortname')
  async settingIntegrations(
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return this.service.getServiceSettingIntegrations(company, integratedModule);
  }

  @Put('/setting/integrations/:shortname')
  async upsertSettingIntegrations(
    @Body() data: ServiceIntegrationDTO,
    @GetAuthData('company') company: Company,
    @Param('shortname') intergatedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return this.service.upsertServicesSettingsIntegrations(company, data, intergatedModule);
  }

  // FOR SERVICES:/ID
  @Get('/:id')
  async getService(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Service>> {
    const service = await this.service.getService(company, id);
    return new ResponseSingleDTO(plainToClass(Service, service));
  }

  @Get('/:id/integrations/:shortname')
  async getServiceIntegrations(
    @Param('id') id: string,
    @Param('shortname') integratedModule: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.getServiceIntegrations(company, id, integratedModule);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateService(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
    @Body() data: serviceDataDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateService(company, id, data);
  }

  @Put('/:id/integrations/:shortname')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateServiceIntegrations(
    @Param('id') id: string,
    @Param('shortname') integratedModule: string,
    @GetAuthData('company') company: Company,
    @Body() data: ServiceIntegrationDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateServiceIntegration(company, id, data, integratedModule);
  }

  //DELETE INDIVIDUAL
  @Delete('/:id')
  async deleteService(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.service.deleteService(company, id);
  }

  //DELETE MANY SERVISES
  @Delete('/')
  async deleteServices(
    @Body('ids') ids: ServicesIdsDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.deleteServices(company, ids);
  }

  //FOR STATUS FOR MANY SERVICES
  @Put('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateServicesStatus(
    @Body() data: UpdateStatusDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateServicesStatus(company, data);
  }

  // FOR STATUS INDIVIDUAL SERVICE
  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateServiceStatus(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
    @Body() data: serviceStatusDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.service.updateServiceStatus(company, id, data);
  }

  // FOR REPORTS
  @Get('/report/general')
  @UsePipes(new ValidationPipe({ transform: true }))
  async reportGeneral(
    @Query() filter: ServiceFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ServiceReportGeneralDTO> {
    return await this.service.getReportGeneral(company, filter);
  }

  // FOR SERVICES /
  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getServices(
    @Query() filter: ServiceFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Service, number, number, number>> {
    const { data, count } = await this.service.getServices(company, filter);
    return new ResponseListDTO(plainToClass(Service, data), count, filter.page, filter.limit);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createService(
    @Body() data: serviceDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.service.createService(company, data);
  }
}
