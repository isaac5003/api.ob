import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { serviceDataDTO } from './dtos/service-data.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { ServiceIntegrationDTO } from './dtos/service-integration.dto';
import { serviceStatusDTO } from './dtos/service-status.dto';
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
    filter: ServiceFilterDTO,
  ): Promise<Service[]> {
    return this.serviceRepository.getServices(company, filter);
  }

  async getService(company: Company, id: string): Promise<Service> {
    return this.serviceRepository.getService(company, id);
  }

  async getServiceIntegrations(
    company: Company,
    id: string,
  ): Promise<ResponseMinimalDTO> {
    const {
      accountingCatalog,
    } = await this.serviceRepository.getService(company, id, ['ac']);

    return {
      integrations: {
        catalog: accountingCatalog ? accountingCatalog.id : null,
      },
    };
  }

  async createService(
    company: Company,
    data: serviceDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const service = await this.serviceRepository.createService(company, data);
    return {
      id: service.id,
      message: 'El servicio se ha creado correctamente',
    };
  }

  async updateService(
    company: Company,
    id: string,
    data: serviceDataDTO | serviceStatusDTO | ServiceIntegrationDTO,
  ): Promise<ResponseMinimalDTO> {
    const service = await this.serviceRepository.updateService(
      company,
      data,
      id,
    );
    return {
      id: service.id,
      message: 'El servicio se ha actualizado correctamente.',
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
