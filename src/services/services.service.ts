import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { serviceCreateDTO } from './dtos/service-create.dto';
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
    company: Company,
    filterDto: ServiceFilterDTO,
  ): Promise<Service[]> {
    return this.serviceRepository.getServices(company, filterDto);
  }

  async getService(company: Company, id: string): Promise<Service> {
    return this.serviceRepository.getService(company, id);
    // return this.serviceRepository.getService(company.id, id);
  }

  async createService(
    company: Company,
    createDTO: serviceCreateDTO,
  ): Promise<ResponseMinimalDTO> {
    const service = await this.serviceRepository.createService(
      company,
      createDTO,
    );
    return {
      id: service.id,
      message: 'Se ha creado el servicio correctamente',
    };
  }
}
