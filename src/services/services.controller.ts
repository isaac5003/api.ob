import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO } from 'src/_dtos/responseList.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './Service.entity';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getServices(
    @Query() filterDto: ServiceFilterDTO,
  ): Promise<ResponseListDTO<Service>> {
    const services = await this.servicesService.getServices(filterDto);
    return new ResponseListDTO(plainToClass(Service, services));
  }

  @Get('/:id')
  async getService(@Param('id') id: string) {
    return this.servicesService.getService(id);
  }
}
