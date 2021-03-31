import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './entities/Service.entity';
import { ServicesService } from './services.service';
import { AuthGuard } from '@nestjs/passport';
import { GetCompany } from 'src/auth/get-company.decorator';
import { Company } from 'src/companies/entities/Company.entity';

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
    const services = await this.servicesService.getServices(
      company.id,
      filterDto,
    );
    return new ResponseListDTO(plainToClass(Service, services));
  }

  @Get('/:id')
  async getService(
    @Param('id') id: string,
  ): Promise<ResponseSingleDTO<Service>> {
    const service = await this.servicesService.getService(id);
    return new ResponseSingleDTO(plainToClass(Service, service));
  }
}
