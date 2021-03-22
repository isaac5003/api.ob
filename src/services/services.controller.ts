import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceFilterDto } from './dtos/service-filter.dto';
import { Service } from './Service.entity';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  getServices(@Query() filterDto: ServiceFilterDto): Promise<Service[]> {
    return this.servicesService.getServices(filterDto);
  }
}
