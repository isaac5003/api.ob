import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { serviceDataDTO } from './dtos/service-data.dto';
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
    createDTO: serviceDataDTO,
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

  async deleteService(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    const result = await this.serviceRepository.deleteService(company, id);
    return {
      message: result
        ? 'Se ha eliminado el servicio correctamente'
        : 'No se ha podido eliminar el servicio',
    };
  }
}
