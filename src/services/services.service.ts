import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceFilterDto } from './dtos/service-filter.dto';
import { Service } from './Service.entity';
import { ServiceRepository } from './Service.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}
  async getServices(filterDto: ServiceFilterDto): Promise<Service[]> {
    return this.serviceRepository.getServices(filterDto);
  }
}
