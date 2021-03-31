import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './entities/Service.entity';
import { ServiceRepository } from './repositories/Service.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async getServices(
    company: string,
    filterDto: ServiceFilterDTO,
  ): Promise<Service[]> {
    return this.serviceRepository.getServices(company, filterDto);
  }

  async getService(id: string): Promise<Service> {
    return this.serviceRepository.getService(id);
  }
}
