import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { ServiceIntegrations } from '../entities/ServiceIntegrations.entity';

const reponame = 'configuracioón de servicio';
@EntityRepository(ServiceIntegrations)
export class ServiceIntegrationsRepository extends Repository<ServiceIntegrations> {
  /**
   * Metodo para obtner las configuraciones almacenadas en la base de datos
   * @param company Compañia con la que esta logado el usuario que solicita el modulo
   * @returns retorna un arreglo con todos los registros almacenados en la tabla
   */
  async getServicesIntegrations(company: Company): Promise<ServiceIntegrations[]> {
    let settingIntegrations: ServiceIntegrations[];
    const leftJoinAndSelect = {
      com: 'ci.company',
      module: 'ci.module',
    };

    try {
      settingIntegrations = await this.find({
        where: { company },
        join: {
          alias: 'ci',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return settingIntegrations;
  }

  /**
   * Metodo utilizado para actualizar o insertar registros a la tabla serviceintegrations
   * @param data Campos de los que se hara insert o update
   * @returns retorna un arreglo de los campos que se insertaron o actulizaron
   */
  async upsertServicesIntegrations(data: any): Promise<ServiceIntegrations[]> {
    // crea sucursal
    let response: ServiceIntegrations[];
    try {
      response = await this.save(data);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
