import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './Service.entity';
import { ServiceRepository } from './Service.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async getServices(filterDto: ServiceFilterDTO): Promise<Service[]> {
    return this.serviceRepository.getServices(filterDto);
  }

  async getService(id: string): Promise<Service> {
    return this.serviceRepository.getService(id);
  }
}
