import { Dependencies, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRepository } from 'src/system/repositories/Module.repository';
import { ResponseMinimalDTO, ServiceReportGeneralDTO } from 'src/_dtos/responseList.dto';
import { Company } from '../companies/entities/Company.entity';
import { AccountingCatalogRepository } from '../entries/repositories/AccountingCatalog.repository';
import { ServicesIdsDTO } from './dtos/delete-updateServices/service-deleteupdate.dto';
import { UpdateStatusDTO } from './dtos/delete-updateServices/service-update-status.dto';
import { serviceDataDTO } from './dtos/service-data.dto';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { ServiceIntegrationDTO } from './dtos/service-integration.dto';
import { serviceStatusDTO } from './dtos/service-status.dto';
import { SellingType } from '../system/entities/SellingType.entity';
import { Service } from './entities/Service.entity';
import { SellingTypeRepository } from '../system/repositories/SellingType.repository';
import { ServiceRepository } from './repositories/Service.repository';
import { ServiceIntegrationsRepository } from './repositories/ServiceIntegrations.repository';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,

    @InjectRepository(ServiceIntegrationsRepository)
    private serviceIntegrationsRepository: ServiceIntegrationsRepository,

    @InjectRepository(SellingTypeRepository)
    private sellingTypeRepository: SellingTypeRepository,

    @InjectRepository(AccountingCatalogRepository)
    private accountingCatalogRepository: AccountingCatalogRepository,

    @InjectRepository(ModuleRepository)
    private moduleRepository: ModuleRepository,
  ) {}

  async getSellyingTypes(): Promise<{ data: SellingType[]; count: number }> {
    return this.sellingTypeRepository.getSellyingTypes();
  }

  async getReportGeneral(company: Company, filter: ServiceFilterDTO): Promise<ServiceReportGeneralDTO> {
    const { name, nit, nrc } = company;

    let index = 1;
    const { data } = await this.serviceRepository.getFilteredServices(company, filter);
    return {
      company: { name, nit, nrc },
      services: data.map((s) => {
        return {
          index: index++,
          ...s,
        };
      }),
    };
  }

  async getServices(company: Company, filter: ServiceFilterDTO): Promise<{ data: Service[]; count: number }> {
    return this.serviceRepository.getFilteredServices(company, filter);
  }

  async getService(company: Company, id: string): Promise<Service> {
    return this.serviceRepository.getService(company, id);
  }

  async getServiceIntegrations(company: Company, id: string, integratedModule): Promise<ResponseMinimalDTO> {
    let integrations = {};
    switch (integratedModule) {
      case 'entries':
        const { accountingCatalogSales } = await this.serviceRepository.getService(company, id, ['ac']);

        integrations = {
          ...integrations,
          entries: {
            accountingCatalogSales: accountingCatalogSales ? accountingCatalogSales.id : null,
          },
        };
    }
    return integrations;
  }

  async createService(company: Company, data: serviceDataDTO): Promise<ResponseMinimalDTO> {
    await this.sellingTypeRepository.getSellingType(data.sellingType as any as number);
    const service = await this.serviceRepository.createService(company, data);
    return {
      id: service.id,
      message: 'El servicio se ha creado correctamente',
    };
  }

  async updateService(company: Company, id: string, data: serviceDataDTO): Promise<ResponseMinimalDTO> {
    await this.serviceRepository.getService(company, id);
    await this.sellingTypeRepository.getSellingType(data.sellingType as any as number);
    const service = await this.serviceRepository.updateService(company, data, id);
    return {
      id: service.id,
      message: 'El servicio se ha actualizado correctamente.',
    };
  }

  async updateServiceStatus(company: Company, id: string, data: serviceStatusDTO): Promise<ResponseMinimalDTO> {
    await this.serviceRepository.getService(company, id);
    const service = await this.serviceRepository.updateService(company, data, id);
    return {
      id: service.id,
      message: 'El servicio se ha actualizado correctamente.',
    };
  }
  async updateServiceIntegration(
    company: Company,
    id: string,
    data: ServiceIntegrationDTO,
    integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    await this.serviceRepository.getService(company, id);

    switch (integratedModule) {
      case 'entries':
        if (data.accountingCatalogSales) {
          await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogSales, company);
        }
        break;
    }
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
      data.ids as unknown as ServicesIdsDTO['ids'],
    );

    const servicesUpdated = await this.serviceRepository.updateServicesStatus(company, {
      ids: servicesToUpdate.map((s) => s.id),
      active: data.active,
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
    const idToCompare = ids as unknown as any[];

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

  /**
   * Metodo utilizado para estructurar la respuesta y los campos de configuraciones de integracion que se necesita
   * enviar en la petición
   * @param company compañia con la que esta logado el usuario que invoic el metodo
   * @param integratedModule Modulo con el que tiene la integracion el usuario
   * @returns Retorna un objeto con los campos accountingCatalogCXC y accountingCatalogSales
   */
  async getServiceSettingIntegrations(company: Company, integratedModule: string): Promise<ResponseMinimalDTO> {
    const settings = await this.serviceIntegrationsRepository.getServicesIntegrations(company);
    const modules = await this.moduleRepository.getModules();
    const integrations = {};
    switch (integratedModule) {
      case 'entries':
        const filteredModules = [...new Set(settings.map((s) => s.module.id))];

        const foundModules = modules.filter((m) => filteredModules.includes(m.id));

        for (const f of foundModules) {
          const values = settings
            .filter((s) => filteredModules.includes(s.module.id))
            .map((s) => {
              return {
                metaKey: s.metaKey,
                metaValue: s.metaValue,
              };
            });

          const data = {};
          for (const v of values) {
            data[v.metaKey] = v.metaValue;
          }

          integrations[f.shortName] = data;
        }

        break;
    }
    const nullResponse = { entries: { accountingCatalogSales: null } };
    return Object.keys(integrations).length > 0 ? integrations : nullResponse;
  }

  /**
   * Metodo para procesar la informacion y hacer el update o insert de las configuraciones de integraciones
   * @param company compañia con la que esta logado el usuario qeu invoca el metodo
   * @param data Campos necesarios para actualizar o insertar registros de configuraciones, del tipo serviceIntegrationDTO
   * @param integratedModule Modulo con el que se desean guiarar las configuraciones de integraciones
   * @returns REtorna el mesanje de exito en caso que no se den errores
   */
  async upsertServicesSettingsIntegrations(
    company: Company,
    data: ServiceIntegrationDTO,
    integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    const settings = await this.serviceIntegrationsRepository.getServicesIntegrations(company);
    const setting = [];

    switch (integratedModule) {
      case 'entries':
        await this.accountingCatalogRepository.getAccountingCatalogNotUsed(data.accountingCatalogSales, company);

        const accountingCatalogSales = settings.find((s) => s.metaKey == 'accountingCatalogSales');

        if (!accountingCatalogSales) {
          setting.push({
            company: company,
            module: 'a98b98e6-b2d5-42a3-853d-9516f64eade8',
            metaKey: 'accountingCatalogSales',
            metaValue: data.accountingCatalogSales,
          });
        } else {
          setting.push({ ...accountingCatalogSales, metaValue: data.accountingCatalogSales });
        }

        break;
    }

    await this.serviceIntegrationsRepository.upsertServicesIntegrations(setting);
    return {
      message: 'La integración ha sido actualizada correctamente.',
    };
  }
}

@Dependencies(ServicesService)
export class ServiceDependentService {
  constructor(serviceService) {
    serviceService = serviceService;
  }
}
