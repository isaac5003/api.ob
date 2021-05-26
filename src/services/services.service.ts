import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../companies/entities/Company.entity';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { ResponseMinimalDTO } from '../_dtos/responseList.dto';
import { ServicesIdsDTO } from './dtos/delete-updateServices/service-deleteupdate.dto';
import { UpdateStatusDTO } from './dtos/delete-updateServices/service-update-status.dto';
import { serviceDataDTO } from './dtos/service-data.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { ServiceIntegrationDTO } from './dtos/service-integration.dto';
import { ServiceReportGeneralDTO } from './dtos/service-report-general.dto';
import { serviceStatusDTO } from './dtos/service-status.dto';
import { SellingType } from './entities/SellingType.entity';
import { Service } from './entities/Service.entity';
import { SellingTypeRepository } from './repositories/SellingType.repository';
import { ServiceRepository } from './repositories/Service.repository';
import { ServiceSettingRepository } from './repositories/ServiceSetting.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,

    @InjectRepository(ServiceSettingRepository)
    private serviceSettingRepository: ServiceSettingRepository,

    @InjectRepository(SellingTypeRepository)
    private sellingTypeRepository: SellingTypeRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,
  ) {}

  async getSellyingTypes(): Promise<SellingType[]> {
    return this.sellingTypeRepository.getSellyingTypes();
  }
  async getServices(company: Company, filter: ServiceFilterDTO): Promise<Service[]> {
    return this.serviceRepository.getFilteredServices(company, filter);
  }

  async getService(company: Company, id: string): Promise<Service> {
    return this.serviceRepository.getService(company, id);
  }

  async getServiceIntegrations(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const { accountingCatalog } = await this.serviceRepository.getService(company, id, ['ac']);

    return {
      integrations: {
        catalog: accountingCatalog ? accountingCatalog.id : null,
      },
    };
  }

  async createService(company: Company, data: serviceDataDTO): Promise<ResponseMinimalDTO> {
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
    const service = await this.serviceRepository.updateService(company, data, id);
    return {
      id: service.id,
      message: 'El servicio se ha actualizado correctamente.',
    };
  }
  async updateServicesStatus(company: Company, data: UpdateStatusDTO): Promise<ResponseMinimalDTO> {
    let message = '';

    const servicesToUpdate = await this.serviceRepository.getServicesByIds(
      company,
      (data.ids as unknown) as ServicesIdsDTO['ids'],
    );

    const servicesUpdated = await this.serviceRepository.updateServicesStatus(company, {
      ids: servicesToUpdate.map((s) => s.id),
      status: data.status,
    });
    const updatedServices = [];
    const notUpdatedServices = [];
    if (data.ids.length != servicesUpdated.affected) {
      for (const id of data.ids) {
        if (servicesToUpdate.map((su) => su.id).includes(id)) {
          updatedServices.push(id);
        } else {
          notUpdatedServices.push(id);
        }

        message =
          notUpdatedServices.length == data.ids.length
            ? 'No se pudieron actulizar los servicios.'
            : updatedServices.length == data.ids.length
            ? `Se actualizaron ${updatedServices.length}/${data.ids.length} servicios correctamente.`
            : `Se actualizron ${updatedServices.length}/${data.ids.length} servicios, no se pudieron actualizar ${notUpdatedServices.length} servicios.`;
      }
    } else {
      message = `Se actualizaron ${servicesUpdated.affected} servicios correctamente.`;
    }

    return {
      message: message,
    };
  }

  async deleteServices(company: Company, ids: ServicesIdsDTO): Promise<ResponseMinimalDTO> {
    const result = await this.serviceRepository.deleteServices(company, ids);
    let message = '';
    const deletedServices = [];
    const notDeletedServices = [];
    const idToCompare = (ids as unknown) as any[];

    if (idToCompare.length != result.deletedServices.affected) {
      for (const ids of idToCompare) {
        if (result.services.includes(ids)) {
          deletedServices.push(ids);
        } else {
          notDeletedServices.push(ids);
        }

        message =
          deletedServices.length == notDeletedServices.length
            ? `Se eliminaron ${deletedServices.length}/${idToCompare.length} servicios.`
            : notDeletedServices.length == idToCompare.length
            ? `No se pudieron eliminar los servicios seleccionados.`
            : `Se eliminaron ${deletedServices.length}/${idToCompare.length} servicios, no se pudieron eliminar ${notDeletedServices.length} servicios.`;
      }
    } else {
      message = `Se eliminaron ${result.deletedServices.affected} servicios correctamente.`;
    }

    return {
      message: message,
    };
  }
  async deleteService(company: Company, id: string): Promise<ResponseMinimalDTO> {
    const result = await this.serviceRepository.deleteService(company, id);
    return {
      message: result ? 'Se ha eliminado el servicio correctamente' : 'No se ha podido eliminar el servicio',
    };
  }

  async getReportGeneral(company: Company, filter): Promise<ServiceReportGeneralDTO> {
    const { name, nit, nrc } = company;

    const services = await this.serviceRepository.getFilteredServices(company, filter);

    return {
      company: { name, nit, nrc },
      services,
    };
  }

  async getSettingsIntegrations(company: Company): Promise<ResponseMinimalDTO> {
    const settings = await this.serviceSettingRepository.getSettings(company);

    return {
      integrations: {
        catalog: settings && settings.accountingCatalog ? settings.accountingCatalog.id : null,
      },
    };
  }

  async updateSettingsIntegrations(company: Company, data: ServiceIntegrationDTO): Promise<ResponseMinimalDTO> {
    await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalog, company);

    const settings = await this.serviceSettingRepository.getSettings(company);

    if (settings) {
      await this.serviceSettingRepository.updateSettings(company, data);
      return {
        message: 'La integración ha sido actualizada correctamente.',
      };
    }

    await this.serviceSettingRepository.createSettings(company, data);
    return {
      message: 'La integración ha sido agregada correctamente.',
    };
  }
}
